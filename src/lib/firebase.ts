"use server";
import admin from "firebase-admin";

const serviceAccount = JSON.parse(
  process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT as string
);

if (admin.apps.length < 1) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export async function getAllProverbs() {
  const snapshot = await db
    .collection("proverbs")
    .orderBy("createdAt", "desc")
    .limit(6)
    .get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    text: doc.data().text,
    voteCount: doc.data().voteCount,
    createdAt: doc.data().createdAt?.toDate(),
  })) as Array<Proverb>;
}

export async function getNextProverbs(lastDoc: Proverb, limit: number = 6) {
  const lastDocRef = await db.collection("proverbs").doc(lastDoc.id).get();
  if (!lastDocRef.exists) {
    throw new Error("Last document not found");
  }
  const snapshot = await db
    .collection("proverbs")
    .orderBy("createdAt", "desc")
    .startAfter(lastDocRef)
    .limit(limit)
    .get();

  snapshot.docs.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    text: doc.data().text,
    voteCount: doc.data().voteCount,
    createdAt: doc.data().createdAt?.toDate(),
  })) as Array<Proverb>;
}

export async function addProverb(proverb: {
  text: string;
  prompt: string;
  voteCount: number;
}) {
  const docRef = await db.collection("proverbs").add({
    text: proverb.text,
    prompt: proverb.prompt,
    voteCount: proverb.voteCount,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return docRef.id;
}

export async function getProverbById(id: string) {
  const doc = await db.collection("proverbs").doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function updateVoteCount(id: string, increment: number) {
  const docRef = db.collection("proverbs").doc(id);
  await docRef.update({
    voteCount: admin.firestore.FieldValue.increment(increment),
  });

  const updatedDoc = await docRef.get();
  return updatedDoc.data()?.voteCount;
}

export async function deleteProverb(id: string) {
  await db.collection("proverbs").doc(id).delete();
}
