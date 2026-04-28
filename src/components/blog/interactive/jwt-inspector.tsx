"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Part = "header" | "payload" | "signature";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

const RAW = {
  header:    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9",
  payload:   "eyJzdWIiOiJ1c2VyXzEyMyIsIm5hbWUiOiJBbGljZSBDaGVuIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM1Njg5NjAwLCJleHAiOjE3MzU2OTY4MDB9",
  signature: "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
};

const DECODED_HEADER = { alg: "RS256", typ: "JWT" };

const DECODED_PAYLOAD: Record<string, string | number> = {
  sub:  "user_123",
  name: "Alice Chen",
  role: "admin",
  iat:  1735689600,
  exp:  1735696800,
};

const CLAIM_DOCS: Record<string, { name: string; desc: string; standard: boolean }> = {
  sub:  { name: "Subject",          standard: true,  desc: "The entity the token identifies — typically a user ID. Must be unique per issuer." },
  iat:  { name: "Issued At",        standard: true,  desc: "Unix timestamp of issuance. Lets servers reject tokens issued before a password reset." },
  exp:  { name: "Expiration Time",  standard: true,  desc: "Unix timestamp after which the server must reject the token. Limits damage from token theft." },
  name: { name: "Name",             standard: false, desc: "Custom claim — display name. Lets clients show the user's name without a DB lookup." },
  role: { name: "Role",             standard: false, desc: "Custom claim — application role. Used for authorization decisions inside the token." },
};

const ALG_DOCS: Record<string, string> = {
  RS256: "RSA + SHA-256. Asymmetric. Private key signs; public key verifies. Services can verify without accessing the signing key.",
  HS256: "HMAC + SHA-256. Symmetric. Same secret signs and verifies. Simpler but every verifier holds the secret.",
  ES256: "ECDSA + SHA-256. Asymmetric like RS256 but smaller keys and faster math.",
};

const PART_COLORS: Record<Part, { text: string; bg: string; border: string; label: string }> = {
  header:    { text: "text-blue-500",    bg: "bg-blue-500/10",    border: "border-blue-500/30",    label: "Header" },
  payload:   { text: "text-primary",     bg: "bg-primary/10",     border: "border-primary/30",     label: "Payload" },
  signature: { text: "text-orange-500",  bg: "bg-orange-400/10",  border: "border-orange-400/30",  label: "Signature" },
};

function fmt(val: string | number, key: string): string {
  if ((key === "iat" || key === "exp") && typeof val === "number") {
    return `${val}  →  ${new Date(val * 1000).toUTCString()}`;
  }
  return String(val);
}

export function JWTInspector() {
  const [active, setActive] = useState<Part | null>(null);

  const toggle = (p: Part) => setActive(prev => prev === p ? null : p);

  const jwt = `${RAW.header}.${RAW.payload}.${RAW.signature}`;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-8 not-prose">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-border bg-secondary/30">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
          JWT Anatomy Inspector — click a segment to decode
        </span>
      </div>

      {/* Raw JWT with clickable parts */}
      <div className="p-4 border-b border-border">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-2">
          Raw token (Base64URL encoded)
        </p>
        <div className="flex flex-wrap gap-0 font-mono text-[10px] leading-relaxed bg-muted/30 rounded-xl p-3 border border-border/50">
          {(["header", "payload", "signature"] as Part[]).map((part, i) => (
            <span key={part}>
              <motion.button
                onClick={() => toggle(part)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={spring}
                className={`cursor-pointer rounded px-0.5 transition-all duration-500 break-all ${
                  active === part
                    ? `${PART_COLORS[part].text} ${PART_COLORS[part].bg} font-bold`
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {RAW[part]}
              </motion.button>
              {i < 2 && <span className="text-muted-foreground/40">.</span>}
            </span>
          ))}
        </div>

        {/* Part legend */}
        <div className="flex gap-3 mt-2">
          {(["header", "payload", "signature"] as Part[]).map(part => (
            <button
              key={part}
              onClick={() => toggle(part)}
              className={`flex items-center gap-1.5 cursor-pointer text-[9px] font-medium transition-all duration-500 ${
                active === part ? PART_COLORS[part].text : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${active === part ? PART_COLORS[part].text.replace("text-", "bg-") : "bg-muted-foreground/40"}`} />
              {PART_COLORS[part].label}
            </button>
          ))}
        </div>
      </div>

      {/* Decoded panel */}
      <AnimatePresence>
        {active && (
          <motion.div
            key={active}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={spring}
            className="overflow-hidden"
          >
            <div className={`p-4 border-b border-border ${PART_COLORS[active].bg}`}>
              <p className={`text-[9px] uppercase tracking-wider mb-3 ${PART_COLORS[active].text}`}>
                Decoded: {PART_COLORS[active].label}
              </p>

              {active === "header" && (
                <div className="space-y-2">
                  {Object.entries(DECODED_HEADER).map(([k, v]) => (
                    <div key={k} className="flex gap-4 text-[11px]">
                      <span className="font-mono font-semibold text-foreground/80 w-8 flex-shrink-0">{k}</span>
                      <span className="font-mono text-primary">{v}</span>
                      {k === "alg" && (
                        <span className="text-muted-foreground">
                          {ALG_DOCS[v as string] ?? ""}
                        </span>
                      )}
                      {k === "typ" && (
                        <span className="text-muted-foreground">Token type — always "JWT"</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {active === "payload" && (
                <div className="space-y-2.5">
                  {Object.entries(DECODED_PAYLOAD).map(([k, v]) => {
                    const doc = CLAIM_DOCS[k];
                    return (
                      <div key={k} className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-[11px] text-foreground/80 w-10 flex-shrink-0">{k}</span>
                          <span className="font-mono text-[10px] text-primary">{fmt(v, k)}</span>
                          {doc && (
                            <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono border ${
                              doc.standard
                                ? "text-primary bg-primary/10 border-primary/20"
                                : "text-muted-foreground bg-muted border-border"
                            }`}>
                              {doc.standard ? "registered" : "custom"}
                            </span>
                          )}
                        </div>
                        {doc && (
                          <p className="text-[10px] text-muted-foreground ml-12">{doc.name}: {doc.desc}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {active === "signature" && (
                <div className="space-y-3 text-[11px]">
                  <div className="font-mono text-[10px] bg-muted/50 rounded-xl p-3 leading-relaxed text-muted-foreground">
                    {`RSASHA256(\n  base64url(header) + "." + base64url(payload),\n  privateKey\n)`}
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { label: "What it proves", val: "The token was created by whoever holds the private key and the payload has not been tampered with." },
                      { label: "What it does NOT prove", val: "The claims are true. Anyone can decode the payload — it is Base64, not encrypted. Do not put secrets in the payload." },
                      { label: "Verification", val: "Server re-hashes header + payload with the public key and checks it matches the signature. If different, the token was tampered." },
                      { label: "Invalidation", val: "JWTs cannot be invalidated before exp without a blocklist (which reintroduces server state). Keep expiry short (15 min) and use refresh tokens." },
                    ].map(({ label, val }) => (
                      <p key={label}>
                        <span className="font-semibold text-foreground/80">{label}: </span>
                        <span className="text-muted-foreground">{val}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!active && (
        <div className="px-4 py-3">
          <p className="text-[9px] text-muted-foreground/50 text-center">
            Click any segment above to decode it
          </p>
        </div>
      )}
    </div>
  );
}
