'use client';
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function LegacyTrainingChallenge() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/app/training/${params.id}`);
  }, [params.id, router]);

  return null;
}
