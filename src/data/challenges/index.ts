import type { ChallengeContent } from "@/types/challenge";
import { djangoChallenges } from "./django";
import { djangoFundamentalsChallenges } from "./django-fundamentals";
import { sqlChallenges } from "./sql";
import { systemDesignChallenges } from "./system-design";

export const challengeContent: Record<string, ChallengeContent> = {
  ...djangoChallenges,
  ...djangoFundamentalsChallenges,
  ...sqlChallenges,
  ...systemDesignChallenges,
};
