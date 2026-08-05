export interface BidExplanation {
    title: string;
    rule: string;
    summary: string;

    highCardPoints: number;

    facts: string[];
    alternatives: string[];
}