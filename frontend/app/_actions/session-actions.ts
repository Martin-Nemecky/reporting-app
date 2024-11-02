"use server";

import { cookies } from "next/headers";
import { decrypt } from "../_lib/session";

export async function getSessionData() {
	const cookieStore = await cookies();
	const encryptedSessionData = cookieStore.get("session")?.value;
	if (encryptedSessionData == null) {
		return null;
	}

	const decryptedSessionData = await decrypt(encryptedSessionData);
	
	if(decryptedSessionData == null) {
		throw new Error("Decrypted session data are not available.");
	}

	const userId = decryptedSessionData.userId as string;
	return { userId: userId };
}
