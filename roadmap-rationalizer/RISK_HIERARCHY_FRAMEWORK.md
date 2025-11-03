# Hierarchical Risk Assessment Framework

**Version 2.0 - October 31, 2025**

## Overview

The Roadmap Rationalizer now uses a **hierarchical risk assessment framework** based on Ron Adner's innovation ecosystem model. This framework provides a more structured and theoretically coherent approach to evaluating strategic risks.

## The Four Risk Pillars

The framework now evaluates every decision branch across **four complementary risk pillars**. Each pillar answers a different question about feasibility, execution, and market traction.

### 1. 💰 Financial Risk

**Key Question:** *"Can we fund and sustain this path without jeopardizing the portfolio?"*

Focus areas: capital requirements, burn rate, runway, ROI sensitivity, opportunity cost, and funding milestones.

**Management Focus:** If HIGH → Restructure capital plan, stage investments, expand funding options, or reconsider scope.

---

### 2. ⚙️ Technical Risk

**Key Question:** *"Can we build and operate it reliably at scale?"*

Focus areas: engineering complexity, technology maturity, scalability, integration dependencies, technical debt, and delivery timeline realism.

**Management Focus:** If HIGH → Prioritize prototyping, architecture reviews, technical hiring, and phased delivery gates.

---

### 3. 👥 Organizational Risk

**Key Question:** *"Do we have the people, processes, and leadership to execute?"*

Focus areas: team expertise, talent gaps, operating model, process maturity, change readiness, leadership alignment, and cultural fit.

**Management Focus:** If HIGH → Invest in hiring/upskilling, operating model redesign, and change management support.

---

### 4. 🌐 Ecosystem Risk

**Key Question:** *"Will partners, suppliers, and the market move with us?"*

Focus areas: partner interdependence, supplier resilience, go-to-market dependencies, adoption barriers, competitive response, and market timing.

**Management Focus:** If HIGH → Strengthen partner agreements, diversify suppliers, secure anchor customers, and recalibrate market entry timing.

---

## Overall Risk Determination

```
Overall Risk = f(Financial, Technical, Organizational, Ecosystem)

Logic:
- If ANY pillar is HIGH → Overall = HIGH
- If all are MEDIUM → Overall = MEDIUM
- If 2+ are LOW and none are HIGH → Overall = LOW
```

This keeps the synthesis conservative: a critical weakness in any pillar elevates the overall assessment.

---

## Advantages of the New Hierarchy

### 1. **Eliminates Redundancy**
- Old system: Initiative/competitive categories overlapped and created double counting.
- New system: Four orthogonal pillars (financial, technical, organizational, ecosystem) with clear ownership.

### 2. **Shows Causal Relationships**
Financial, technical, and organizational readiness feed directly into ecosystem success—weakness in any upstream pillar amplifies downstream market risk.

### 3. **Better Decision-Making**
Each pillar has distinct management implications:
- **Financial issues** → Rework funding, pacing, or investment scope
- **Technical issues** → Increase engineering validation, architecture rigor, or delivery staging
- **Organizational issues** → Address talent/process gaps, leadership alignment, or change management
- **Ecosystem issues** → Strengthen supplier/partner agreements and adapt go-to-market sequencing

### 4. **Theoretically Grounded**
Based on Ron Adner's peer-reviewed research on innovation ecosystems, providing academic rigor.

### 5. **Quantitatively Sound**
- Ecosystem risk blends multiplicative partner probabilities with adoption timeline analysis
- Financial, technical, and organizational pillars remain qualitative but severity-tagged for synthesis

---

## Visual Representation

### In the Tree Diagram

Each decision branch now connects to **four risk nodes** (Financial, Technical, Organizational, Ecosystem):

```
Decision Branch                    Risk Pillars
┌──────────────┐                  
│ Manufacturing│      ┌─────► 💰 Financial [HIGH]
│   Scale-Up   │      │            ├─ Capital intensity
│   [HIGH]     │──────┼            └─ Runway compression
└──────────────┘      │
                      ├─────► ⚙️ Technical [HIGH]
                      │            ├─ Custom equipment
                      │            └─ Yield risk
                      │
                      ├─────► 👥 Organizational [MEDIUM]
                      │            ├─ Talent gaps
                      │            └─ Process maturity
                      │
                      └─────► 🌐 Ecosystem [HIGH]
                                   ├─ Partner interdependence (36% joint prob)
                                   └─ Adoption timeline (27-48 mo)
```

Each dimension node displays:
- Icon and label
- Sublabel (e.g., "Internal Capability")
- Risk level badge (HIGH/MEDIUM/LOW)

---

## API Structure

### Risk Analysis Functions (4 specialist queries + synthesis)

1. `analyzeFinancialRisk(context, branchName)`
2. `analyzeTechnicalRisk(context, branchName)`
3. `analyzeOrganizationalRisk(context, branchName)`
4. `analyzeEcosystemRisk(context, branchName)`

**Overall Assessment:**
5. `determineRiskLevel(context, branchName, riskAnalyses)`
   - Returns per-pillar severities, overall level, reasoning, and top mitigations

### Data Structure

```javascript
branch = {
  name: string,
  description: string,
  riskLevel: "HIGH" | "MEDIUM" | "LOW",  // Overall
  riskDimensions: {
    financial: "HIGH" | "MEDIUM" | "LOW",
    technical: "HIGH" | "MEDIUM" | "LOW",
    organizational: "HIGH" | "MEDIUM" | "LOW",
    ecosystem: "HIGH" | "MEDIUM" | "LOW",
  },
  reasoning: string,
  riskAnalyses: {
    financial: string,
    technical: string,
    organizational: string,
    ecosystem: string,
  },
  mitigation: string[],
}
```

---

## Interpreting Results

### Example: Manufacturing Scale-Up

```
Overall Risk: HIGH

Dimensional Assessment:
├─ Value Creation: HIGH
│  ├─ Financial: Need $15-25M, extended cash flow gap
│  ├─ Technical: Unproven processes at scale, low initial yields
│  └─ Organizational: Limited manufacturing expertise
│
├─ Value Delivery: HIGH
│  ├─ 4 critical partners, 36% joint success probability
│  └─ Single-source material dependencies
│
└─ Value Capture: HIGH
   ├─ 27-48 month cumulative adoption timeline
   ├─ Intense LCD incumbent competition
   └─ Unproven customer value proposition at scale

Interpretation:
- **Financial (HIGH):** Capital intensity and burn quickly exhaust runway without phased investment.
- **Technical (HIGH):** Custom equipment and yield risk threaten delivery timelines.
- **Organizational (MEDIUM):** Talent and process gaps exist but are solvable with targeted hiring.
- **Ecosystem (HIGH):** Multiple critical partners and long adoption cycles amplify external exposure.

Mitigation Priority:
1. Stage funding and leverage EMS partnerships to reduce upfront capital burn (financial).
2. Co-invest with equipment manufacturers and run pilot lines to de-risk yields (technical).
3. Stand up a manufacturing operations squad and change program to close capability gaps (organizational).
4. Secure anchor OEM deals with milestone-based incentives to pull ecosystem adoption forward (ecosystem).
```

---

## Migration from Previous Version

### Old Structure → New Pillars Mapping

| Legacy Dimension | New Pillar |
|------------------|------------|
| Value Creation → Financial Viability | 💰 Financial Risk |
| Value Creation → Technical Feasibility | ⚙️ Technical Risk |
| Value Creation → Organizational Capability | 👥 Organizational Risk |
| Value Delivery (partners & supply chain) | 🌐 Ecosystem Risk |
| Value Capture (market adoption & competition) | 🌐 Ecosystem Risk |

### Breaking Changes

1. **API Function Names**:
   - ✅ `analyzeFinancialRisk`
   - ✅ `analyzeTechnicalRisk`
   - ✅ `analyzeOrganizationalRisk`
   - ✅ `analyzeEcosystemRisk`
   - ❌ `analyzeValueDeliveryRisk`, `analyzeValueCaptureRisk` (removed)

2. **Data Structure**:
   - `branch.riskDimensions` now stores `{ financial, technical, organizational, ecosystem }`
   - `branch.riskAnalyses` now stores `{ financial, technical, organizational, ecosystem }`

3. **Mock Data Exports**:
   - New helpers surface the four pillars directly (`mockRiskAnalyses`, `mockRiskLevels`)

---

## References

**Theoretical Foundation:**
- Adner, Ron. "Match Your Innovation Strategy to Your Innovation Ecosystem." *Harvard Business Review*, 2006.
- Adner, Ron. *The Wide Lens: What Successful Innovators See That Others Miss*. Portfolio, 2013.

**Implementation:**
- `src/services/perplexityApi.js` - Risk analysis functions
- `src/services/mockData.js` - Mock data with hierarchical structure
- `src/components/TreeDiagram.jsx` - Hierarchical visualization
- `src/utils/exportReport.js` - Hierarchical report generation

---

## Summary

The hierarchical risk framework provides a **theoretically rigorous, practically useful** approach to strategic risk assessment. By organizing risks into four complementary pillars—financial, technical, organizational, and ecosystem—it enables sharper decision-making while eliminating the redundancy and confusion of the previous flat structure.

Each pillar answers a fundamental question, surfaces distinct signals, and points to specific mitigation plays, making it a powerful tool for strategic planning.

