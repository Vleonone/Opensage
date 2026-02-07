import { OracleJudgment } from "../oracle/engine.js";

export enum ModelTier {
    REFLEX = "reflex",
    STANDARD = "standard",
    DEEP = "deep",
}

// Map user intent to specific model IDs
// In a real implementation, these would come from config/providers.ts
export const TIER_MODEL_MAP = {
    // Tier 1: Instant & Cheap via OpenRouter/Groq
    [ModelTier.REFLEX]: ["openrouter:groq/llama-3-8b-8192", "openrouter:google/gemma-7b-it", "ollama:qwen2.5:0.5b"],
    // Tier 2: Standard Balance (OpenRouter)
    [ModelTier.STANDARD]: ["openrouter:openai/gpt-4o-mini", "openrouter:anthropic/claude-3-haiku", "openrouter:google/gemini-flash-1.5"],
    // Tier 3: Deep Reasoning (OpenRouter)
    [ModelTier.DEEP]: ["openrouter:anthropic/claude-3.5-sonnet", "openrouter:openai/gpt-4o"],
};

export class CascadingRouter {
    /**
     * Decides the initial model tier based on the Oracle's judgment.
     */
    decideTier(judgment: OracleJudgment | null): ModelTier {
        // Fail-safe: If Oracle is down (null), default to Standard tier.
        if (!judgment) {
            return ModelTier.STANDARD;
        }

        // Direct mapping from Oracle suggestion
        switch (judgment.suggested_tier) {
            case "reflex":
                return ModelTier.REFLEX;
            case "deep":
                return ModelTier.DEEP;
            case "standard":
            default:
                return ModelTier.STANDARD;
        }
    }

    /**
     * Resolves the specific model ID for a given tier.
     * This logic can be expanded to check availability, cost, or user preference.
     */
    resolveModel(tier: ModelTier): string {
        const candidates = TIER_MODEL_MAP[tier];
        // Simple logic: return the first available one. 
        // TODO: Integrate with availability check.
        return candidates[0];
    }
}
