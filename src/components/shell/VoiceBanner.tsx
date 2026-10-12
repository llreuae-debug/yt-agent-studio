"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { getVoiceProfile, isVoiceProfileEmpty } from "@/lib/storage";

export function VoiceBanner() {
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    const profile = getVoiceProfile();
    setEmpty(isVoiceProfileEmpty(profile));
  }, []);

  if (!empty) return null;

  return (
    <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-card border border-warn/30 bg-warn/10 p-4 sm:p-5 text-txt">
      <div className="flex items-center gap-3">
        <div className="rounded-pill bg-warn/20 p-2.5 text-warn shrink-0">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <h4 className="type-h3 font-black text-txt">Voice Profile Not Configured</h4>
          <p className="type-small text-txt-2 mt-0.5">
            Add your voice profile first. A script in the wrong voice is unreadable on camera.
          </p>
        </div>
      </div>
      <Link
        href="/voice"
        className="flex shrink-0 items-center gap-1.5 rounded-pill bg-warn text-black px-4 py-2 text-xs font-bold hover:bg-warn/90 transition-all shadow-md"
      >
        <span>Set Voice Profile</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
