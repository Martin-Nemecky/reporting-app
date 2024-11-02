import "server-only";

import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);
const algorithm = "HS256";

export async function createSession(userId: string) {
	const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
	const session = await encrypt({ userId, expiresAt });

    const cookieStore = await cookies();
	cookieStore.set("session", session, {
		httpOnly: true,
		secure: true,
		expires: expiresAt,
		sameSite: "lax",
		path: "/",
	});
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}

export async function encrypt(payload: JWTPayload) {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: algorithm })
		.setIssuedAt()
		.setExpirationTime("1d")
		.sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
	try {
		const { payload } = await jwtVerify(session, encodedKey, {
			algorithms: [algorithm],
		});

		return payload;
	} catch (error : unknown) {
        if(error instanceof Error){
          console.log(error.message);
        } else {
            console.log("User's credentials were not correct.");
        }
	}
}
