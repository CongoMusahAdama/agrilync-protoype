import type { GrowerProfile } from '@/utils/authToken';
import type { GrowerAssignedAgent } from '@/contexts/GrowerContext';

/** Shape expected by GrowerIdCardVisual / buildGrowerCardData */
export const buildFarmerForCard = (
    grower: GrowerProfile,
    assignedAgent?: GrowerAssignedAgent | null
) => ({
    ...grower,
    id: grower.lyncId || grower.id,
    agent: assignedAgent
        ? { name: assignedAgent.name, agentId: assignedAgent.agentId }
        : undefined,
    agentId: assignedAgent?.agentId,
    onboardingAgentId: grower.onboardingAgentId || assignedAgent?.agentId,
});
