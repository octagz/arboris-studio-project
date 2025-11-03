// Mock data based on roadmap-risk-analysis.html
// This allows development without making API calls

const DEFAULT_DECISION_YEAR = 2025;

export const mockContext = `E Ink is developing electronic paper (e-paper) display technology for multiple markets. The product roadmap involves significant financial, technical, and competitive challenges across staged market entry (retail signage → flat-panel displays → radio paper). Key considerations include manufacturing scale-up from prototypes, technology platform evolution (resolution, color, wireless), strategic partnerships, funding requirements, and patent protection.`;

export const mockBranches = [
  {
    name: "Manufacturing Scale-Up",
    description: "Decision on how and when to transition from hand-assembled prototypes to scalable, automated manufacturing processes for large-area displays, balancing speed, cost, and reliability."
  },
  {
    name: "Market Sequencing",
    description: "Choice of which target markets to prioritize at each roadmap phase—retail signage, consumer electronics, or publishing—based on technical readiness, revenue potential, and competitive landscape."
  },
  {
    name: "Technology Platform Evolution",
    description: "Determining the timing and scope of investments in advanced features such as higher resolution, color capability, wireless updates, and integration with transistor backplanes to enable entry into new segments."
  },
  {
    name: "Partnership and Go-To-Market Strategy",
    description: "Selecting strategic partners and distribution models (e.g., direct sales vs. licensing) to accelerate market entry, secure key reference customers, and defend against incumbents."
  },
  {
    name: "Funding and Resource Allocation",
    description: "Deciding on the timing, amount, and sources of additional funding rounds to support R&D, production scale-up, and market expansion, while managing cash flow and risk."
  },
  {
    name: "Patent and IP Strategy",
    description: "Choice of how aggressively to pursue patent protection, licensing, and competitive differentiation to safeguard technology advantages and support long-term growth."
  }
];

// Legacy mock data structure retained for reference; new API uses financial/technical/organizational/ecosystem pillars
export const mockValueCreationRisks = {
  "Manufacturing Scale-Up": {
    financialViability: `## Financial Viability Analysis: Manufacturing Scale-Up

**Severity Rating: HIGH**

### Capital Requirements
Transitioning from hand-assembled prototypes to automated manufacturing requires significant capital investment estimated at $15-25M for production equipment, tooling, and facility upgrades. This represents a substantial deployment of resources relative to E Ink's current funding runway.

### Cash Flow Management
The manufacturing scale-up phase will significantly increase monthly burn rate from approximately $1M to $3-4M during the 12-18 month transition period. Revenue realization from scaled production won't occur until 18-24 months post-investment, creating a challenging cash flow gap that must be bridged through additional funding.

### ROI Considerations
While potential returns are attractive (targeting 40-50% gross margins at scale), the investment payback period extends 3-5 years. This long timeline increases exposure to market timing risks and competitive threats. The opportunity cost is significant—capital deployed here cannot be used for R&D or market development initiatives.

**Critical Financial Risks:**
- Insufficient capital to complete manufacturing scale-up without additional dilutive funding
- Extended time-to-revenue creating cash flow stress
- Risk of overinvestment if market adoption slower than projected
- Limited financial flexibility to pivot if technical or market assumptions prove incorrect
- Dependency on achieving volume economics; sub-scale production would be financially unviable`,
    
    technicalFeasibility: `## Technical Feasibility Analysis: Manufacturing Scale-Up

**Severity Rating: HIGH**

### Engineering Complexity
Scaling microcapsule-based e-paper from lab prototypes to high-volume automated production is extremely complex. Key challenges include maintaining uniform microcapsule distribution across large-area displays, achieving consistent optical performance, and ensuring reliable encapsulation. The process involves 15+ critical steps, each requiring precise control.

### Technology Maturity
While the core technology has been proven at prototype scale, automated high-volume manufacturing processes are unproven. Critical equipment (coating machinery, encapsulation systems) would need to be custom-developed or heavily modified from existing tools. Process yields in early production are likely to be low (30-50%) before optimization.

### Scalability Challenges
Achieving 98%+ three-year lifespan reliability at scale is technically demanding. Small variations in manufacturing conditions (temperature, humidity, material batching) can significantly impact product quality. Scaling from displays of 6-12 inches to 15-20+ inches introduces exponentially more potential defect sites.

**Critical Technical Risks:**
- Unproven manufacturing processes at target volume and quality levels
- Custom equipment development may face unforeseen technical obstacles
- Low initial yields could delay time-to-market and increase costs
- Materials science challenges in maintaining consistency across batches
- Integration complexity with transistor backplanes for active-matrix displays
- Inadequate process control systems could lead to quality variability`,
    
    organizationalCapability: `## Organizational Capability Analysis: Manufacturing Scale-Up

**Severity Rating: MEDIUM**

### Team Expertise
E Ink's current team has strong R&D and materials science expertise but limited high-volume manufacturing experience. The transition requires bringing in process engineers, manufacturing operations specialists, and quality control experts—skillsets currently underrepresented. Leadership has consumer electronics experience but primarily from R&D perspective.

### Talent Acquisition Challenges
Finding experienced process engineers with flexible display or advanced materials manufacturing experience will be difficult. This is a specialized talent pool, and competitors (display incumbents) offer more established career paths and compensation packages. Time-to-productivity for new hires will be 6-12 months.

### Process Maturity
Current processes are lab-scale and R&D-focused. The organization lacks formal production process documentation, statistical process control systems, and quality management frameworks (ISO 9001, etc.) required for high-volume manufacturing. Building this operational infrastructure will require 12-18 months.

### Organizational Structure & Culture
The company culture is innovation and research-oriented. Shifting to a manufacturing-operations mindset represents a significant cultural change that may face internal resistance. The organizational structure will need to add a VP of Manufacturing Operations and build out a production organization—a major structural shift.

**Critical Capability Gaps:**
- Lack of high-volume manufacturing expertise and leadership
- Insufficient process engineering and quality control capabilities
- No established manufacturing operations infrastructure
- Cultural misalignment between R&D-focus and operations-focus
- Limited experience managing contract manufacturers (if pursuing EMS model)
- Inadequate change management capability for organization-wide transformation`
  },
};

// Helper function to generate mock data for remaining branches
function generateValueCreationMock(branchName, financialSeverity, technicalSeverity, orgSeverity) {
  return {
    financialViability: `## Financial Viability Analysis: ${branchName}\n\n**Severity Rating: ${financialSeverity}**\n\nThis branch requires significant capital investment with extended time-to-revenue. Key financial considerations include capital requirements, cash flow management, ROI potential, and resource allocation trade-offs. ${financialSeverity === 'HIGH' ? 'Substantial funding gaps and high burn rate create significant financial exposure.' : 'Financial requirements are manageable within current funding runway.'}`,
    
    technicalFeasibility: `## Technical Feasibility Analysis: ${branchName}\n\n**Severity Rating: ${technicalSeverity}**\n\nTechnical complexity involves ${technicalSeverity === 'HIGH' ? 'significant engineering challenges with unproven processes at scale' : 'moderate technical challenges with established foundational capabilities'}. Key considerations include engineering complexity, technology maturity, scalability, and integration requirements.`,
    
    organizationalCapability: `## Organizational Capability Analysis: ${branchName}\n\n**Severity Rating: ${orgSeverity}**\n\nOrganizational readiness assessment indicates ${orgSeverity === 'HIGH' ? 'substantial capability gaps requiring significant talent acquisition and process development' : 'adequate core capabilities with identified gaps that can be addressed through targeted hiring and training'}. Focus areas include team expertise, process maturity, and cultural alignment.`
  };
}

function generateValueDeliveryMock(branchName, severity, partnerCount, jointProb) {
  return {
    analysis: `## Value Delivery Risk Analysis: ${branchName}\n\n**Severity Rating: ${severity}**\n\n### Interdependence Risk\nThis initiative requires coordination with ${partnerCount} critical partners. Joint probability of success: ${jointProb}% (multiplicative risk). ${severity === 'HIGH' ? 'Multiple critical dependencies create significant delivery risk.' : 'Partner dependencies are manageable with appropriate coordination.'}\n\n### Supply Chain Risk\nSupply chain analysis indicates ${severity === 'HIGH' ? 'significant vulnerabilities including single-source dependencies and material availability constraints' : 'moderate supply chain risks with established supplier relationships'}.`
  };
}

function generateValueCaptureMock(branchName, severity, adoptionMonths) {
  return {
    analysis: `## Value Capture Risk Analysis: ${branchName}\n\n**Severity Rating: ${severity}**\n\n### Integration Risk\nCumulative adoption timeline: ${adoptionMonths} months across value chain intermediaries. ${severity === 'HIGH' ? 'Extended adoption cycles and high switching costs create significant barriers.' : 'Adoption barriers are manageable with appropriate go-to-market strategies.'}\n\n### Competitive Dynamics\n${severity === 'HIGH' ? 'Intense competitive pressure from well-funded incumbents with established market positions.' : 'Competitive landscape presents challenges but differentiation opportunities exist.'}\n\n### Market Viability\nMarket demand assessment indicates ${severity === 'HIGH' ? 'significant uncertainty around TAM/SAM validation and customer value proposition' : 'reasonable market opportunity with identified customer segments'}.`
  };
}

// Add abbreviated mock data for remaining branches
Object.assign(mockValueCreationRisks, {
  "Market Sequencing": generateValueCreationMock("Market Sequencing", "HIGH", "MEDIUM", "MEDIUM"),
  "Technology Platform Evolution": generateValueCreationMock("Technology Platform Evolution", "HIGH", "HIGH", "MEDIUM"),
  "Partnership and Go-To-Market Strategy": generateValueCreationMock("Partnership and Go-To-Market Strategy", "MEDIUM", "MEDIUM", "MEDIUM"),
  "Funding and Resource Allocation": generateValueCreationMock("Funding and Resource Allocation", "HIGH", "LOW", "LOW"),
  "Patent and IP Strategy": generateValueCreationMock("Patent and IP Strategy", "MEDIUM", "LOW", "MEDIUM"),
});

export const mockValueDeliveryRisks = {
  "Manufacturing Scale-Up": {
    analysis: `## Value Delivery Risk Analysis: Manufacturing Scale-Up

**Severity Rating: HIGH**

### 1. Interdependence Risk Assessment

#### Partner Dependencies
Manufacturing scale-up requires successful coordination with 4-5 critical complementary innovators:

1. **Custom Equipment Manufacturers** (coating and encapsulation machinery)
   - Must develop specialized equipment that doesn't exist in standard form
   - Estimated success probability: 70% (novel equipment development)
   
2. **Microcapsule Material Suppliers**
   - Must scale their production to match E Ink's volume requirements
   - Estimated success probability: 85% (scaling existing process)
   
3. **Flexible Substrate Suppliers**
   - Must deliver substrates meeting optical and mechanical specifications at volume
   - Estimated success probability: 80% (some development required)
   
4. **Transistor Backplane Manufacturers** (for active-matrix versions)
   - Must develop TFT backplanes compatible with E Ink's process
   - Estimated success probability: 75% (significant technical challenges)

**Key Mitigation Strategies:**
- Develop dual-source relationships for critical materials where possible
- Co-invest in equipment development with manufacturers to align incentives and accelerate timelines
- Consider strategic partnerships or acquisitions to internalize critical weak links
- Stage manufacturing scale-up to validate partner performance before full commitment
- Establish contractual penalties and milestone-based payments to keep partners on track`
  },
};

// Add mock data for remaining branches
Object.assign(mockValueDeliveryRisks, {
  "Market Sequencing": generateValueDeliveryMock("Market Sequencing", "HIGH", 3, 51),
  "Technology Platform Evolution": generateValueDeliveryMock("Technology Platform Evolution", "HIGH", 5, 17),
  "Partnership and Go-To-Market Strategy": generateValueDeliveryMock("Partnership and Go-To-Market Strategy", "MEDIUM", 2, 64),
  "Funding and Resource Allocation": generateValueDeliveryMock("Funding and Resource Allocation", "MEDIUM", 2, 70),
  "Patent and IP Strategy": generateValueDeliveryMock("Patent and IP Strategy", "LOW", 1, 85),
});

export const mockValueCaptureRisks = {
  "Manufacturing Scale-Up": {
    analysis: `## Value Capture Risk Analysis: Manufacturing Scale-Up

**Severity Rating: HIGH**

### 1. Integration Risk (Value Chain Adoption)

#### Value Chain Mapping
**Innovation → Equipment Suppliers → E Ink Manufacturing → Display Integrators/OEMs → Consumer Electronics Brands → Retail Channels → End Consumers**

#### Intermediary Adoption Analysis

**Phase 1: Equipment Suppliers** (6-12 months)
- **Adoption Cycle**: Awareness (2-3 mo) + Development (4-6 mo) + Testing (2-3 mo)
- **Cost-Benefit**: High development costs ($2-5M per tool) with uncertain volume forecasts makes this a challenging business case for equipment suppliers
- **Switching Costs**: Minimal for suppliers (they're building new capability)
- **Key Barrier**: Need volume commitments from E Ink to justify investment

**Phase 2: Display Integrators & OEMs** (12-18 months)
- **Adoption Cycle**: Awareness (3 mo) + Testing/Qualification (6-9 mo) + Design-in (6-9 mo) + Production Ramp (3-6 mo)
- **Cost-Benefit**: Moderate—e-paper offers differentiation but requires significant product redesign
- **Switching Costs**: HIGH—existing products designed around LCD; redesign costs $1-5M per SKU
- **Key Barrier**: Risk aversion; OEMs want proven technology at scale before commitment

**Phase 3: Consumer Electronics Brands** (6-12 months)
- **Adoption Cycle**: Evaluation (3-4 mo) + Testing (2-4 mo) + Product Planning (4-6 mo)
- **Cost-Benefit**: Differentiation value is strong but unproven consumer demand
- **Switching Costs**: Moderate—marketing and sales training required
- **Key Barrier**: Want to see early traction before major commitments

**Phase 4: Retail Channels** (3-6 months)
- **Adoption Cycle**: Product introduction and sales enablement
- **Cost-Benefit**: Generally favorable if brand demand exists
- **Switching Costs**: Low
- **Key Barrier**: Shelf space allocation; need strong brand pull-through

**Cumulative Adoption Timeline: 27-48 months from manufacturing readiness to end-consumer scale**

This extended timeline creates significant financial and competitive exposure. Even after manufacturing scale-up is complete, nearly 2-4 additional years are required before meaningful revenue realization.

**Key Mitigation Strategies:**
- Secure one or two anchor OEM customers early with co-development agreements to accelerate adoption
- Focus on niche applications (e-readers, signage) where value proposition is clearest and switching costs are lower
- Build reference designs and development kits to reduce integration barriers for OEMs
- Consider exclusive partnerships or licensing to accelerate market entry through established players
- Develop customer success programs to ensure early deployments succeed and create positive case studies
- Stage market entry: prove technology in forgiving applications before targeting mainstream consumer electronics`
  },
};

// Add mock data for remaining branches
Object.assign(mockValueCaptureRisks, {
  "Market Sequencing": generateValueCaptureMock("Market Sequencing", "HIGH", "30-42"),
  "Technology Platform Evolution": generateValueCaptureMock("Technology Platform Evolution", "HIGH", "48-72"),
  "Partnership and Go-To-Market Strategy": generateValueCaptureMock("Partnership and Go-To-Market Strategy", "HIGH", "24-36"),
  "Funding and Resource Allocation": generateValueCaptureMock("Funding and Resource Allocation", "MEDIUM", "18-30"),
  "Patent and IP Strategy": generateValueCaptureMock("Patent and IP Strategy", "MEDIUM", "12-24"),
});

const legacyMockRiskAnalyses = {
  "Manufacturing Scale-Up": {
    ecosystemic: `## Ecosystemic Risk Analysis: Manufacturing Scale-Up

### **1. Initiative Risks**

**Product Feasibility:** *Severity: High*
- Transitioning from hand-assembled prototypes to automated manufacturing processes introduces significant uncertainties around achieving consistent quality and reliability at scale. The microcapsule technology must maintain a 98%+ three-year lifespan reliability, which is unproven at large volumes.

**Customer Benefit:** *Severity: Medium*
- While the technology offers clear advantages (flexibility, bistability, low power), the value proposition must be validated at scale with actual customer deployments. Early failures could undermine market confidence.

**Supply Chain Appropriateness:** *Severity: High*
- Dependencies on specialized materials (microcapsules, flexible substrates, electronic components) and manufacturing equipment create supply chain vulnerabilities. Limited supplier options and potential bottlenecks could delay production ramp-up.

**Project Team Quality:** *Severity: Medium*
- Scaling requires specialized expertise in materials science, process engineering, and high-volume manufacturing that may not be fully available in-house. Building or acquiring this capability is critical.

### **2. Interdependence Risks**

**Partner Dependencies:** *Severity: High*
- **Critical Partners Required:**
  - Equipment manufacturers for specialized coating and encapsulation machinery
  - Raw material suppliers for microcapsules and substrates
  - Contract manufacturers (if pursuing EMS model)
  - Transistor backplane suppliers for later phases

**Joint Probability Analysis:**
- If each partner has an 80% probability of delivering on time, the joint probability of all four succeeding = 0.8^4 = 41%. This multiplicative risk significantly increases project uncertainty.

**Weak Links and Bottlenecks:**
- Equipment development is a critical weak link—custom machinery may face unforeseen technical challenges
- Single-source dependencies for specialized materials create existential risks if suppliers fail

**Delay Factors:**
- Equipment suppliers may face their own R&D challenges
- Financial difficulties at partner companies could halt progress
- Regulatory approvals for materials or processes could introduce delays

*Overall Interdependence Risk: High*

### **3. Integration Risks**

**Value Chain Mapping:**
Innovation → Equipment Suppliers → Manufacturing → System Integrators → OEMs → Retail Channels → End Consumers

**Intermediary Adoption Requirements:**

1. **Equipment Suppliers** (6-12 months)
   - Must develop, test, and certify custom manufacturing equipment
   - Cost-benefit: High development costs may deter participation without guaranteed volumes
   
2. **System Integrators/OEMs** (12-18 months)
   - Must test, qualify, and integrate displays into products
   - Adoption cycle: awareness (2-3 months) + testing (6-9 months) + acceptance (3-6 months)
   - Switching costs: Significant redesign and requalification of existing products
   
3. **Retail Channels** (3-6 months)
   - Must understand value proposition and integrate into sales processes
   - Cost-benefit: Generally favorable if OEM adoption is strong

**Cumulative Adoption Delays:** 21-36 months from manufacturing readiness to end-consumer availability

**Cost-Benefit Balance:**
- Equipment suppliers: Marginal unless volumes are guaranteed
- OEMs: Favorable for differentiation but high switching costs and integration complexity
- Retailers: Generally favorable if customer demand exists

*Overall Integration Risk: High*

---

**Summary:** Manufacturing scale-up faces high ecosystemic risk across all three dimensions, with particularly acute challenges in interdependence (multiple critical partners with compounding failure probabilities) and integration (lengthy, multi-stakeholder adoption process with significant switching costs at each step).`,
    
    financial: `The **financial risks** associated with the "Manufacturing Scale-Up" decision branch for E Ink's product roadmap are substantial and multifaceted, given the large capital requirements, uncertain demand, and competitive market dynamics.

**Key Financial Risks:**

- **Overinvestment and Underutilization Risk:**  
  Significant upfront investment is required to scale manufacturing capacity (e.g., moving from hand-made to mechanical processes), with projections of $20M in the current round and up to $100M for full-scale radio paper production. If demand forecasts are overly optimistic, excess capacity may remain underutilized, leading to poor financial performance, capital write-offs, and delayed breakeven.

- **Cash Flow Strain and Burn Rate Escalation:**  
  Scaling up will at least double the monthly burn rate (from ~$500K to ~$1M/month), consuming cash reserves rapidly before significant revenues materialize. Misjudging the timing of investment versus revenue realization can create liquidity bottlenecks and increase the risk of insolvency if additional funding or revenue is delayed.

- **Demand Uncertainty and Market Volatility:**  
  Target markets are large but unproven for this new technology, and electronics demand can be highly volatile. Overestimating adoption rates (especially in early phases or new segments) risks idle capacity and inventory write-downs.

**Mitigation Approaches:**

- **Flexible Manufacturing Models:**  
  Leveraging contract manufacturing or EMS partnerships can reduce capital outlays, provide scalability, and limit financial exposure if demand falls short, as opposed to building fully-owned facilities.

- **Phased Investment and Demand Validation:**  
  Closely tie manufacturing scale-up to validated demand signals (e.g., binding orders, reference customers) and stage investments to minimize up-front risk.`,
    
    technical: `Manufacturing scale-up for E Ink's radio paper and large-area displays presents several significant **technical risks** that must be proactively managed to ensure successful commercialization.

**Key Technical Risks for Manufacturing Scale-Up:**

- **Process Reliability and Yield:** Transitioning from hand-made prototypes to mechanical, large-scale manufacturing introduces risk of *unpredictable defects*, especially with the microcapsule technology. Larger batches can behave differently due to changes in heat transfer, reagent addition, and mixing methods, which may impact product consistency and reliability. Achieving a 98%+ three-year lifespan for displays depends on tight control of these variables.

- **Equipment and Process Scale-Up Hazards:**
  - **Thermal Management:** Larger-scale chemical processes carry greater risk of thermal runaway or fire, as the energy and reagent quantities increase. Temperature control and continuous monitoring are critical.
  - **Material Handling:** Scaling up involves handling larger volumes of solvents and reagents, increasing splash risk, difficulty in pouring/transfers, and potential for spills or equipment failure.

- **Integration Complexity:**
  - **Backplane Integration:** For later phases, integrating electronic ink with transistor backplanes is technically challenging and requires further R&D. Any failure to achieve robust integration at scale will impact product viability.
  - **Quality Assurance:** As manufacturing volumes increase, maintaining stringent QA/QC to detect and remedy defects becomes more complex and resource-intensive.`,
    
    competitive: `The **competitive risks** associated with the "Manufacturing Scale-Up" decision branch for E Ink's radio paper and display roadmap are substantial and multifaceted, reflecting both general electronics manufacturing challenges and the specific dynamics of the display technology sector.

**Key Competitive Risks in Manufacturing Scale-Up:**

- **Rapid Technology Evolution and Short Product Life Cycles**  
  The display technology market is marked by **fast innovation cycles**—competitors (LCD, OLED, Gyricon, etc.) are constantly improving performance, cost, and features. If E Ink's manufacturing scale-up lags or faces delays, there is a high risk that rival technologies will leapfrog E Ink's offering.

- **Quality Control and Brand Reputation**  
  Scaling from prototype to mass production introduces risks of **inconsistent quality, higher defect rates, and reliability issues**. In a new technology category, early quality failures can damage brand reputation and provide ammunition for incumbent competitors.

- **Cost Pressures and Price Competition**  
  As E Ink ramps up, **incumbents with greater scale can leverage lower manufacturing costs, established supply chains, and pricing power** to undercut E Ink, squeezing margins and threatening profitability.`
  },
  
  "Market Sequencing": {
    ecosystemic: `## Ecosystemic Risk Analysis: Market Sequencing

### **1. Initiative Risks**

**Product Feasibility:** *Severity: High*
- Each market phase requires different technical specifications and maturity levels. Phase I (retail signage) is more achievable, but Phases II and III face escalating technical complexity that may not be deliverable on planned timelines.

**Customer Benefit:** *Severity: Medium*
- Value proposition varies significantly by market segment. Retail signage benefits (flexibility, power savings) are clear but limited market size. Publishing market (Phase III) offers largest potential but unproven customer willingness to adopt.

**Competition:** *Severity: High*
- Each market phase faces different competitive threats: LCD/LED in signage, OLED in flat panels, paper/tablets in publishing. Sequential entry allows competitors to observe and respond to each move.

**Supply Chain Appropriateness:** *Severity: Medium*
- Different markets require different supply chain configurations, making it difficult to build economies of scale across phases.

### **2. Interdependence Risks**

**Partner Dependencies:** *Severity: High*
- **Phase I (Retail Signage):**
  - Display manufacturers
  - Retail channel partners
  - Content management system providers
  
- **Phase II (Flat Panels):**
  - Consumer electronics OEMs
  - Transistor backplane suppliers
  - Distribution partners
  
- **Phase III (Publishing):**
  - Publishers and content providers
  - Wireless infrastructure partners
  - Book retailers and distributors

**Joint Probability Analysis:**
- Sequential dependencies compound risk. Success in Phase III requires success in Phases I and II first.
- If each phase has 70% probability of success, overall probability of reaching Phase III successfully = 0.7^3 = 34%

**Weak Links:**
- Content ecosystem development is a critical weak link for Phase III
- OEM partnerships for Phase II depend on proven Phase I success
- Any phase failure derails subsequent phases

*Overall Interdependence Risk: High*

### **3. Integration Risks**

**Value Chain Complexity:**
- Each market segment requires building entirely new value chains with different intermediaries
- Learning from one phase may not transfer effectively to subsequent phases

**Phase I Intermediaries:** Retail system integrators → Retailers → End displays
**Phase II Intermediaries:** OEMs → Electronics retailers → Consumers  
**Phase III Intermediaries:** Publishers → Content aggregators → Distribution → Consumers

**Cumulative Adoption Timeline:**
- Phase I: 12-18 months to full retail adoption
- Phase II: 18-24 months for consumer electronics integration
- Phase III: 24-36 months for publishing ecosystem development
- **Total time to Phase III market entry: 5-7 years**

**Integration Barriers:**
- Each intermediary requires different education, incentives, and integration support
- Switching costs are high at each step due to established alternatives
- Cost-benefit balance varies significantly—some intermediaries may resist adoption

*Overall Integration Risk: High*`,
    
    financial: `The **"Market Sequencing"** decision branch—launching first in retail signage, then expanding to flat panels, and ultimately pursuing publishing/radio paper—entails significant financial risks at each stage due to capital intensity, market timing, technical hurdles, and competitive dynamics.

**Key Financial Risks:**

- **High Upfront and Sequential Capital Requirements:**  
  The staged approach requires cumulative investments of $20M (retail signage), $30–$50M (flat panels), and $50–$100M (publishing), with a burn rate rising from $500K/month to ~$1M/month as operations scale.

- **Delayed Revenue and Negative Cash Flow:**  
  The reliance on each phase to finance the next means that any delays in achieving commercial readiness will extend the negative cash flow period, increasing insolvency risk.

- **Market Size and Adoption Uncertainty:**  
  The initial retail signage market is unproven for this technology. Later phases target much larger markets, but these are highly competitive and may have shifting customer requirements.`,
    
    technical: `The **technical risks** associated with the "Market Sequencing" decision branch—moving from large-area displays (retail signage) to flat-panel consumer electronics and finally to radio paper—stem from multiple factors related to technology maturity, integration complexity, and scalability.

**Key Technical Risks:**

- **Technology Maturity and Readiness**
  - **Large-area displays** (Phase I) are technically less demanding but scaling from prototypes poses risks around microcapsule stability.
  - **Flat-panel displays** (Phase II) require integration with advanced transistor backplanes, a major leap in complexity.
  - **Radio paper** (Phase III) compounds technical risks: achieving high resolution, color, ultra-low power, and robust wireless connectivity.

- **Integration Challenges**
  - Modern flat-panel displays are vulnerable to electromagnetic eavesdropping risks.
  - Moving from experimental fabrication to full-scale, reliable mechanical production introduces risks of technical debt.`,
    
    competitive: `The **competitive risks** associated with the "Market Sequencing" decision branch are substantial and multi-dimensional:

**1. Incumbent Entrenchment and Fast-Follower Risk**
- **LCD and OLED manufacturers** have significant R&D budgets and global manufacturing scale. If E Ink's initial retail signage phase demonstrates commercial viability, these incumbents may rapidly adapt and leverage existing relationships to defend share.

- **Gyricon (Xerox)** and other electronic paper rivals can accelerate their own development in response, potentially neutralizing E Ink's differentiation.

**2. Market Entry Timing and Sequencing Risks**
- **Delayed advancement** from Phase I to II/III increases exposure to competitive learning curves. If technical hurdles slow E Ink's progression, competitors may catch up or leapfrog.

**3. Differentiation and Defensibility Challenges**
- E Ink's **core advantages** (flexibility, bistability, low power) are meaningful, but **barriers to entry are not insurmountable**. Larger competitors can invest to replicate these features.`
  },
  
  "Technology Platform Evolution": {
    ecosystemic: `## Ecosystemic Risk Analysis: Technology Platform Evolution

### **1. Initiative Risks**

**Product Feasibility:** *Severity: High*
- Radio paper vision requires convergence of multiple advanced capabilities (flexibility, high resolution, color, wireless, ultra-low power) not yet demonstrated at commercial scale. Technical feasibility of achieving all specifications simultaneously is unproven.

**Customer Benefit:** *Severity: Medium*
- While individual features offer clear benefits, the complete value proposition depends on achieving the full feature set. Partial implementations may not deliver sufficient customer value to justify adoption.

**Competition:** *Severity: High*
- Platform evolution timeline (5-7 years) provides ample opportunity for competitors to leapfrog with alternative technologies or replicate key innovations.

**Project Team Quality:** *Severity: High*
- Requires world-class expertise across multiple domains: materials science, electronics, wireless systems, power management, and manufacturing. Building this multidisciplinary team is challenging.

### **2. Interdependence Risks**

**Partner Dependencies:** *Severity: High*
- **Critical technology partners:**
  - Flexible transistor backplane developers
  - Color filter technology providers
  - Wireless chipset manufacturers
  - Battery/power management innovators
  - Flexible substrate suppliers

**Joint Probability Analysis:**
- Platform requires 5+ complementary innovations to succeed in parallel
- If each has 70% individual success probability, joint probability = 0.7^5 = 17%
- **This extremely low probability represents severe interdependence risk**

**Weak Links:**
- Flexible transistor integration is a known weak link with high technical barriers
- Wireless power efficiency requirements may not be achievable with current technology
- Color implementation at required resolution and power levels is unproven

**Delay Factors:**
- Any partner facing technical setbacks delays entire platform
- Regulatory approvals for wireless technologies could introduce multi-year delays
- Patent disputes or licensing complications could block critical technologies

*Overall Interdependence Risk: High*

### **3. Integration Risks**

**Value Chain for Radio Paper:**
Innovation → Component Suppliers → Display Module Assembly → Device OEMs → Content Publishers → Distribution → Consumers

**Intermediary Adoption Analysis:**

1. **Component Suppliers** (12-18 months)
   - Must develop and qualify specialized components
   - Cost-benefit: Uncertain ROI given unproven market demand
   
2. **Display Module Assemblers** (18-24 months)
   - Must develop assembly processes and quality systems
   - Switching costs: High capital investment in specialized equipment
   
3. **Device OEMs** (24-36 months)
   - Must design, test, and launch products around new display technology
   - Adoption barriers: Risk aversion, established relationships with current suppliers, need for proven reliability
   
4. **Content Publishers** (12-24 months parallel track)
   - Must adapt content, distribution systems, and business models
   - Cost-benefit: Digital distribution disrupts traditional revenue models—may resist
   
5. **Distribution Channels** (6-12 months)
   - Must establish merchandising, support, and sales processes
   - Generally follows OEM and publisher adoption

**Cumulative Delays:** 6-10 years from technology readiness to mass market adoption

**Critical Integration Barriers:**
- Publishers face cannibalization risk from digital distribution
- OEMs require multi-year product development cycles
- Each intermediary needs proof of downstream demand before committing
- Chicken-and-egg problem: Consumers need content, publishers need installed base

*Overall Integration Risk: High*

---

**Summary:** Technology Platform Evolution faces extreme ecosystemic risk, particularly in interdependence (17% joint probability of partner success) and integration (6-10 year adoption timeline with circular dependencies). This represents the highest-risk strategic option.`,
    
    financial: `The decision to pursue **Technology Platform Evolution** for E Ink's product roadmap introduces several critical **financial risks** that could materially impact investment returns and long-term viability.

**Key Financial Risks:**

- **High Capital Requirements and Uncertain ROI:**  
  Advancing from retail signage to consumer electronics and ultimately to radio paper requires staged investments totaling $100M+ over several years. There is a risk of sunk costs if technical hurdles or market adoption issues delay or derail later stages.

- **Time-to-Market and Cash Flow Strain:**  
  The burn rate is projected to rise from $500K to $1M/month. Any delays in achieving commercial readiness will extend the negative cash flow period, potentially requiring additional funding rounds.

- **Technology Obsolescence and Competitive Displacement:**  
  Rapid evolution in display technologies increases the risk that E Ink's platform could become obsolete before achieving scale, especially given the large R&D budgets of incumbents.`,
    
    technical: `The **technology platform evolution** branch—transitioning from large-area displays to flat-panel and ultimately to "radio paper"—faces several significant technical risks:

**1. Technical Complexity and Feasibility**
- **Radio paper** demands flexibility, high resolution, color, wireless connectivity, and ultra-low power—a convergence not yet demonstrated at commercial scale.
- Achieving reliable **integration with transistor backplanes** for flat-panel displays is a recognized technical hurdle.

**2. Required Expertise and Team Capabilities**
- Advancing from experimental approaches to systematic, scalable process engineering requires specialized skills in materials science, electronics, and high-throughput manufacturing.

**3. Integration Challenges**
- For **flat-panel displays**, seamless integration with existing electronics is non-trivial.
- **Radio paper** will require integration of display, power management, and wireless modules onto flexible substrates.`,
    
    competitive: `The **competitive risks** associated with the "Technology Platform Evolution" decision branch are substantial, spanning technology, market dynamics, and strategic defensibility.

**1. Incumbent Dominance and R&D Scale**
- **Major players** like Samsung Display, LG Display, and BOE Technology currently command over 65% of the flexible display market, leveraging massive R&D budgets and large-scale manufacturing.

**2. Rapid Technology Advancement and Substitution Risk**
- The **pace of innovation** in flexible display technologies is high. E Ink's platform could be leapfrogged by emerging technologies if competitors achieve similar flexibility, color, or cost-effectiveness first.

**3. Barriers to Entry and Defensibility**
- While high manufacturing complexity creates barriers, incumbents are better positioned to absorb these costs and solve yield issues.

**4. Retaliation and Competitive Response**
- Established players can retaliate with price cuts, accelerated innovation, or exclusive partnerships if E Ink begins to win high-profile contracts.`
  },
  
  "Partnership and Go-To-Market Strategy": {
    ecosystemic: `## Ecosystemic Risk Analysis: Partnership and Go-To-Market Strategy

### **1. Initiative Risks**

**Product Feasibility:** *Severity: Medium*
- Partnership strategy can accelerate or de-risk technical development, but introduces dependency on partner capabilities and priorities.

**Customer Benefit:** *Severity: Medium*
- Partners bring market access and credibility, but may dilute direct customer feedback loops critical for product-market fit refinement.

**Competition:** *Severity: High*
- Partnership announcements signal strategic direction to competitors, allowing them to pre-empt or respond. Exclusive partnerships may lock out important channels but also constrain flexibility.

**Supply Chain Appropriateness:** *Severity: Medium*
- Partners can provide supply chain access but create single points of failure if relationships deteriorate.

### **2. Interdependence Risks**

**Partner Dependencies:** *Severity: High*
- **Critical partner types:**
  - Manufacturing partners (EMS, contract manufacturers)
  - Technology partners (backplane, materials, components)
  - Go-to-market partners (OEMs, integrators, distributors)
  - Content partners (publishers, content platforms)

**Joint Probability Analysis:**
- Success requires simultaneous coordination across 4+ partner categories
- If each partnership has 75% probability of effective execution, joint probability = 0.75^4 = 32%
- Historical data shows 40% of technology partnerships fail to operationalize

**Weak Links:**
- Content partnerships are particularly fragile due to business model disruption concerns
- Manufacturing partners may lack commitment without guaranteed volumes
- Technology partners may prioritize their own roadmaps over E Ink's needs

**Delay Factors:**
- Partnership negotiation and contract cycles: 6-18 months
- Integration and alignment delays: 6-12 months
- Partner internal decision-making and resource allocation delays
- Leadership changes or strategic pivots at partner organizations
- Financial difficulties at partners could trigger contract renegotiation or termination

*Overall Interdependence Risk: High*

### **3. Integration Risks**

**Value Chain Through Partnerships:**
E Ink → Technology Partners → Manufacturing Partners → OEM Partners → Distribution Partners → Retailers → Consumers

**Partnership Adoption Timeline:**

1. **Technology Partner Integration** (12-18 months)
   - Must align roadmaps, share IP, integrate technologies
   - Cost-benefit: Partners need confidence in market potential
   - Switching costs: Significant technical and relationship investment
   
2. **Manufacturing Partner Onboarding** (18-24 months)
   - Must transfer knowledge, qualify processes, ramp production
   - Adoption barriers: Partners require volume commitments to justify capacity investment
   
3. **OEM Partner Product Development** (24-36 months)
   - OEMs must design, test, and launch products
   - Cost-benefit calculation: OEMs weigh differentiation benefits against risk and integration costs
   - Major barrier: OEMs typically require multiple supplier options, but E Ink may be sole source initially
   
4. **Distribution Partner Enablement** (6-12 months)
   - Training, marketing support, channel inventory
   - Generally follows OEM commitment

**Cumulative Timeline:** 5-7 years from partnership initiation to scaled market presence

**Integration Barriers:**
- Each partner requires customized agreements, incentives, and support
- Misaligned incentives: Partners may prioritize competing products or technologies
- Control and coordination complexity increases exponentially with partner count
- Information asymmetry and trust-building take significant time

*Overall Integration Risk: High*

---

**Summary:** Partnership strategy faces high ecosystemic risk across all dimensions, with particularly acute challenges in interdependence (32% joint probability of effective execution, 40% historical partnership failure rate) and integration (5-7 year timeline with complex multi-partner coordination requirements).`,
    
    financial: `The **financial risks** associated with the "Partnership and Go-To-Market Strategy" for E Ink's radio paper and display products are significant and multifaceted.

**Key Financial Risks:**

- **High Capital Requirements vs. Uncertain ROI**
  - The staged product roadmap demands $20M for current commercialization, $30–$50M for the next phase, and $50–$100M for full publishing market entry.
  
- **Partnership Execution and Failure Risk**
  - Industry data shows that up to 40% of technology partnerships fail to operationalize, and even successful launches often disappoint financially.
  
- **Time-to-Market and Cash Flow Pressure**
  - Delays in partnership negotiations or go-to-market execution can extend the period before revenue generation, exacerbating cash flow strain.`,
    
    technical: `The **technical risks** for the "Partnership and Go-To-Market Strategy" center on technology maturity, integration demands, scalability, and security vulnerabilities.

**Key Technical Risks:**

- **Technology Maturity and Feasibility**
  - The foundational technology is still transitioning from experimental to methodical development.
  - Manufacturing must scale from prototypes to reliable mass production.
  
- **Integration and Compatibility**
  - Integration with existing systems requires deep technical alignment and may expose unforeseen incompatibilities.
  
- **Security and Privacy Risks**
  - Electronic displays are vulnerable to electromagnetic eavesdropping, where radio frequency emissions can be intercepted to reconstruct on-screen content.`,
    
    competitive: `The **competitive risks** associated with the "Partnership and Go-To-Market Strategy" are significant and multifaceted.

**Key Competitive Risks:**

- **Rapid Imitation and Partnership Copycats:**  
  Strategic partnerships are a primary mode of competitive differentiation. Competitors can quickly replicate partnership strategies or form their own alliances, potentially neutralizing E Ink's first-mover advantages.

- **Incumbent Retaliation and Channel Blocking:**  
  Incumbents may respond aggressively, leveraging their scale to block E Ink from critical distribution channels or undercut on price.

- **Dependence on Partner Performance:**  
  Overreliance on a few key partners exposes E Ink to risks if those partners underperform, shift strategic focus, or form alliances with competitors.`
  },
  
  "Funding and Resource Allocation": {
    ecosystemic: `## Ecosystemic Risk Analysis: Funding and Resource Allocation

### **1. Initiative Risks**

**Product Feasibility:** *Severity: High*
- Inadequate funding or misallocated resources could prevent achievement of technical milestones, creating a vicious cycle where failure to demonstrate progress makes subsequent funding more difficult.

**Customer Benefit:** *Severity: Medium*
- Under-investment in customer validation and market testing could lead to products that don't meet market needs, wasting resources on wrong priorities.

**Supply Chain Appropriateness:** *Severity: High*
- Resource constraints may force use of inadequate or unreliable suppliers, compromising quality and reliability.

**Project Team Quality:** *Severity: High*
- Insufficient funding limits ability to attract and retain top talent, particularly in competitive hiring markets for specialized expertise.

### **2. Interdependence Risks**

**Partner Dependencies:** *Severity: High*
- **Funding ecosystem dependencies:**
  - Venture capital investors for Series A/B/C rounds
  - Strategic investors or corporate partners
  - Government grants or subsidies
  - Customer pre-payments or development contracts
  - Debt financing providers

**Joint Probability Analysis:**
- Staged roadmap requires successful funding at multiple gates
- If each funding round has 70% probability of success at required valuation, probability of securing all three stages = 0.7^3 = 34%
- Market conditions, competitive developments, or technical setbacks can dramatically reduce funding probability

**Weak Links:**
- Bridge between phases is critical weak link—any gap in funding creates existential risk
- Dependence on specific investors who may change strategy or face their own portfolio constraints
- Market timing risk: downturn could close funding windows

**Delay Factors:**
- Fundraising cycles typically take 6-12 months, extending cash runway requirements
- Due diligence delays from investors
- Market conditions may force lower valuations or extended timelines
- Investor syndication and coordination challenges

*Overall Interdependence Risk: High*

### **3. Integration Risks**

**Resource Deployment Value Chain:**
Funding → Internal Resource Allocation → Development Execution → Milestones → Market Validation → Next Funding Round

**Adoption and Execution Cycles:**

1. **Investor Community Adoption** (6-12 months per round)
   - Must educate investors on technology, market opportunity, and competitive positioning
   - Adoption barriers: New technology category, long commercialization timeline, capital intensity
   - Cost-benefit for investors: High risk premium required, dilution concerns
   
2. **Internal Resource Allocation** (3-6 months per planning cycle)
   - Must align organization on priorities, allocate across competing initiatives
   - Integration challenge: Balancing short-term needs (survival) with long-term goals (platform development)
   
3. **Execution and Milestone Achievement** (12-24 months per phase)
   - Must convert resources into demonstrable progress
   - Barriers: Technical uncertainties, team scaling challenges, process maturity
   
4. **Market Validation** (6-18 months)
   - Must prove value proposition to customers and partners
   - Switching costs for customers: High, creating slow adoption
   
5. **Next Funding Cycle Preparation** (Ongoing)
   - Must continuously demonstrate progress and manage investor expectations

**Cumulative Timeline:** 3-5 years per major phase, with continuous fundraising pressure

**Integration Barriers:**
- Misalignment between funding timelines and development realities
- Investor expectations may not match technical or market maturation pace
- Each funding round introduces new stakeholders with different expectations
- Board composition changes can shift strategic direction

*Overall Integration Risk: High*

---

**Summary:** Funding and resource allocation faces high ecosystemic risk with particularly acute challenges in interdependence (34% probability of securing all required funding stages, plus external market dependencies) and integration (continuous need to balance investor expectations with technical realities across 3-5 year cycles).`,
    
    financial: `The **financial risks** associated with the "Funding and Resource Allocation" decision branch are substantial and multi-dimensional.

**Key Financial Risks:**

- **High Capital Requirements and Burn Rate**
  - The roadmap requires at least $100M+ in staged investment.
  - The current burn rate is $500K/month, projected to rise to ~$1M/month with scaling.

- **Uncertain Revenue Realization and Time to Market**
  - Early revenue targets depend on rapid commercialization. Technical or production delays can push out revenue timelines.
  
- **Market Size Validation and Penetration Risks**
  - While TAMs are large, actual addressable market (SAM/SOM) may be much smaller if adoption is slow or if competitors respond aggressively.`,
    
    technical: `The decision branch "Funding and Resource Allocation" is exposed to several technical risks that affect the ability to deliver on product goals.

**Key Technical Risks:**

- **Manufacturing Scale-Up Challenges**
  - Moving from hand-made prototypes to large-scale mechanical production involves maintaining 98%+ three-year lifespan reliability.
  - Flexible displays are prone to mechanical failures such as delamination, buckling, and plastic deformation.
  
- **Integration and Performance Risks**
  - Achieving seamless integration with transistor backplanes is technically demanding.
  - Overheating and loss of conductivity are emerging risks as devices become thinner.

- **Technology Maturity and Feasibility**
  - Bistable, flexible displays are at an early stage; unforeseen reliability issues could arise during scale-up.`,
    
    competitive: `The **competitive risks** associated with the "Funding and Resource Allocation" decision branch are substantial.

**Key Competitive Risks:**

- **Incumbent Dominance and R&D Scale:** Major players control over 65% of the flexible display market, leveraging massive R&D budgets and large-scale manufacturing.

- **Market Entry Barriers:** The high production costs, technical complexity, and yield issues make it difficult for newcomers to compete on price and reliability.

- **Rapid Technological Evolution:** The market is experiencing fast innovation cycles with new entrants developing advanced displays.

- **Supply Chain and Scale Risks:** Limited availability of suitable substrates and manufacturing equipment creates bottlenecks.`
  },
  
  "Patent and IP Strategy": {
    ecosystemic: `## Ecosystemic Risk Analysis: Patent and IP Strategy

### **1. Initiative Risks**

**Product Feasibility:** *Severity: Medium*
- IP strategy affects ability to implement certain technical approaches. Patent constraints or litigation risk may force suboptimal technical solutions.

**Customer Benefit:** *Severity: Low*
- Generally indirect impact, but defensive patent strategy could limit feature innovation or increase costs passed to customers.

**Competition:** *Severity: High*
- Patents provide competitive defense but also signal technical approach to competitors. Weak IP position invites infringement and competitive copying.

**Project Team Quality:** *Severity: Medium*
- Requires specialized patent attorneys and IP strategists with deep technical understanding, which are scarce and expensive.

### **2. Interdependence Risks**

**Partner Dependencies:** *Severity: High*
- **IP ecosystem dependencies:**
  - Patent attorneys and IP law firms
  - Patent offices (USPTO, EPO, etc.) for prosecution
  - Third-party technology licensors
  - Standards bodies for industry standards participation
  - Legal system for enforcement

**Joint Probability Analysis:**
- Strong IP position requires successful patent prosecution in multiple jurisdictions
- If each of 5 key patent families has 70% probability of successful prosecution with meaningful claims, joint probability = 0.7^5 = 17%
- Patent litigation has unpredictable outcomes even with strong patents

**Weak Links:**
- Patent office quality and consistency varies significantly across jurisdictions
- Examiner expertise and interpretation can make or break patent value
- Legal system delays and costs can make enforcement impractical even with valid patents
- Third-party patent holders may block freedom to operate

**Delay Factors:**
- Patent prosecution takes 2-5 years from filing to grant
- Office actions and appeals extend timelines
- International filings require coordination across multiple jurisdictions with different timelines
- Litigation can take 3-7 years to resolve
- Standards body processes can take years to establish relevant IP frameworks

*Overall Interdependence Risk: High*

### **3. Integration Risks**

**IP Strategy Value Chain:**
Innovation → Patent Filing → Prosecution → Grant → Portfolio Management → Enforcement/Licensing → Business Value

**Adoption and Integration Cycles:**

1. **Internal Innovation Capture** (Ongoing, 1-3 months per invention)
   - Must identify, document, and evaluate inventions
   - Integration challenge: Engineers focused on product development, not documentation
   - Cost-benefit: Time away from development activities
   
2. **Patent Office Review** (2-5 years)
   - Must navigate examination, office actions, and potential appeals
   - Adoption barrier: Patent offices have backlogs and varying quality standards
   - Outcome uncertainty: Claims may be significantly narrowed or rejected
   
3. **Portfolio Management** (Ongoing)
   - Must maintain, prune, and extend patent portfolio
   - Integration challenge: Balancing cost of maintenance with strategic value
   - Annual costs accumulate significantly over patent lifetime
   
4. **Business Integration** (Varies)
   - Must align IP strategy with business strategy and product roadmap
   - Integration barrier: Patent timelines don't match product cycles
   - Patents may be granted years after technology becomes obsolete
   
5. **Enforcement or Licensing** (3-7 years if litigation required)
   - Must detect infringement and decide on response
   - Cost-benefit: Legal costs ($2.8-3.5M per case) may exceed value
   - Outcome uncertain: Even strong patents can be invalidated

**Cumulative Timeline:** 5-10 years from invention to realized business value

**Integration Barriers:**
- Patent strategy is inherently backward-looking (protecting past innovations) while business needs forward-looking protection
- Geographic fragmentation requires separate prosecution and enforcement in each market
- Different stakeholders (engineers, lawyers, business strategists) have misaligned perspectives and incentives
- Patent trolls and competitors can weaponize IP system to create costs and delays

*Overall Integration Risk: Medium-High*

---

**Summary:** Patent and IP strategy faces high interdependence risk (17% joint probability of securing strong patent portfolio across key areas, plus litigation uncertainties) and medium-high integration risk (5-10 year timeline from invention to business value, with significant fragmentation and misalignment challenges).`,
    
    financial: `The **financial risks** associated with the "Patent and IP Strategy" branch are substantial and multifaceted.

**Key Financial Risks:**

- **High Upfront and Ongoing Costs:**  
  Patent filing, prosecution, and maintenance are expensive, with a full lifecycle for a single U.S. patent often running into the hundreds of thousands of dollars, especially when international protection is required.
  
- **Litigation and Infringement Exposure:**  
  Defending a single U.S. lawsuit can cost $2.8–$3.5 million. If the company inadvertently infringes on third-party patents, it faces legal costs, injunctions halting sales, and royalties.
  
- **Portfolio Management and Opportunity Cost:**  
  Each dollar spent on weak or non-core patents is a dollar not spent on product development, manufacturing scale-up, or customer acquisition.`,
    
    technical: `The decision branch "Patent and IP Strategy" faces several **technical risks** that can impact the value and defensibility of intellectual property.

**Key Technical Risks:**

- **Patentability and Novelty Risk**
  - The core technologies must be sufficiently novel compared to prior art, including existing electronic paper solutions.
  
- **Reverse Engineering and Emanation Vulnerabilities**
  - Flat-panel displays are susceptible to electromagnetic eavesdropping, where video signals can leak radio frequency emanations.
  - If display technology is easily reverse-engineered through side-channel attacks, patented methods may be copied or circumvented.
  
- **Implementation-Specific IP Risks**
  - Patents may cover high-level concepts, but technical execution details may be hard to patent or easy to design around.`,
    
    competitive: `The primary **competitive risks** for the "Patent and IP Strategy" stem from the need to secure, defend, and leverage intellectual property.

**Key Competitive Risks:**

- **Patent Filing Errors and Jurisdictional Vulnerabilities:**  
  Inconsistent or inaccurate patent filings can result in weakened protection, allowing competitors to exploit loopholes.
  
- **Patent Litigation and Retaliation:**  
  The display market is crowded with well-resourced incumbents, increasing the likelihood of aggressive legal challenges.
  
- **Competitor Workarounds and Innovation Leapfrogging:**  
  If patents are too narrow, competitors may design around them or file for improvements, eroding first-mover advantage.
  
- **Global Enforcement and Institutional Arbitrage:**  
  Variations in IP enforcement across regions create risks that competitors will target jurisdictions with weaker protections.`
  }
};

const legacyMockRiskLevels = {
  "Manufacturing Scale-Up": {
    dimensions: {
      valueCreation: "HIGH",
      valueDelivery: "HIGH",
      valueCapture: "HIGH"
    },
    level: "HIGH",
    reasoning: "All three strategic dimensions present high risk: internal capability gaps in manufacturing expertise and capital constraints (Value Creation), extreme partner interdependencies with only 36% joint success probability (Value Delivery), and 27-48 month adoption timeline with intense incumbent competition (Value Capture).",
    mitigation: [
      "Adopt staged manufacturing approach with EMS partnerships to reduce upfront capital and validate partner performance incrementally",
      "Secure anchor OEM customer early with co-development agreement to de-risk value chain adoption",
      "Co-invest in equipment development with manufacturers to align incentives and accelerate critical weak links"
    ]
  },
  
  "Market Sequencing": {
    dimensions: {
      valueCreation: "HIGH",
      valueDelivery: "HIGH",
      valueCapture: "HIGH"
    },
    level: "HIGH",
    reasoning: "Sequential market entry creates compounding risks across all dimensions with extended capital requirements, multiple partner dependencies at each phase, and cumulative 30-42 month adoption cycles creating prolonged competitive exposure.",
    mitigation: [
      "Implement milestone-based funding gates at each phase with clear go/no-go criteria",
      "Develop strategic partnerships to share risk and accelerate market validation",
      "Run pilot programs in each target market before full commitment to validate demand"
    ]
  },
  
  "Technology Platform Evolution": {
    dimensions: {
      valueCreation: "HIGH",
      valueDelivery: "HIGH",
      valueCapture: "HIGH"
    },
    level: "HIGH",
    reasoning: "Multi-phase platform evolution presents extreme risk across all dimensions: high technical complexity and capital needs (Value Creation), 5+ critical partners with 17% joint success probability (Value Delivery), and 48-72 month adoption timeline (Value Capture).",
    mitigation: [
      "Phase technology investments with strict milestone gates validated through prototypes",
      "Pursue strategic technology partnerships to share development risk and accelerate progress",
      "Maintain flexible roadmap with ability to pivot based on competitive and market signals"
    ]
  },
  
  "Partnership and Go-To-Market Strategy": {
    dimensions: {
      valueCreation: "MEDIUM",
      valueDelivery: "MEDIUM",
      valueCapture: "HIGH"
    },
    level: "HIGH",
    reasoning: "Value Capture risk drives overall HIGH assessment due to intense competitive threats and fragile first-mover advantage, despite moderate internal capabilities and partner dependencies.",
    mitigation: [
      "Structure partnerships with performance-based milestones and exit clauses to limit exposure",
      "Accelerate IP development and product differentiation to defend against imitation",
      "Build strong reference customers early to establish market credibility"
    ]
  },
  
  "Funding and Resource Allocation": {
    dimensions: {
      valueCreation: "HIGH",
      valueDelivery: "MEDIUM",
      valueCapture: "MEDIUM"
    },
    level: "HIGH",
    reasoning: "Value Creation risk dominates with substantial capital requirements ($50M+) and high burn rate creating financial stress, despite moderate partner and market risks.",
    mitigation: [
      "Implement staged investment gating with funds released only upon milestone achievement",
      "Pursue strategic co-development agreements to share costs and validate market demand",
      "Conduct continuous scenario planning to anticipate and address funding gaps proactively"
    ]
  },
  
  "Patent and IP Strategy": {
    dimensions: {
      valueCreation: "MEDIUM",
      valueDelivery: "LOW",
      valueCapture: "MEDIUM"
    },
    level: "MEDIUM",
    reasoning: "Moderate overall risk with manageable internal costs and minimal partner dependencies, though competitive threats from reverse engineering and patent challenges require attention.",
    mitigation: [
      "Conduct rigorous Freedom-to-Operate analyses to avoid infringement litigation",
      "Focus patent portfolio on high-value, defensible IP aligned with commercial strategy",
      "Invest in technical countermeasures (process complexity, trade secrets) alongside patents"
    ]
  }
};

const SEVERITY_ORDER = { LOW: 0, MEDIUM: 1, HIGH: 2 };
const DEFAULT_SEVERITY = 'MEDIUM';

const PRIMARY_MITIGATIONS = {
  financial: 'Recalibrate funding strategy, burn rate, and investment phasing for this branch.',
  technical: 'De-risk critical engineering milestones with prototypes, experiments, and staged delivery gates.',
  organizational: 'Close capability gaps with targeted hiring, enablement, and process maturation.',
  ecosystem: 'Secure partner commitments and accelerate market validation to reduce external dependencies.',
};

function extractSeverity(markdown = '') {
  const match = markdown.match(/severity\s*(rating)?\s*:?\s*(high|medium|low)/i);
  return match ? match[2].toUpperCase() : DEFAULT_SEVERITY;
}

function maxSeverity(levels = []) {
  return levels.reduce((current, level) => {
    const candidate = level && SEVERITY_ORDER[level] !== undefined ? level : DEFAULT_SEVERITY;
    if (SEVERITY_ORDER[candidate] > SEVERITY_ORDER[current]) {
      return candidate;
    }
    return current;
  }, DEFAULT_SEVERITY);
}

function buildEcosystemAnalysis(branchName) {
  const delivery = mockValueDeliveryRisks[branchName]?.analysis;
  const capture = mockValueCaptureRisks[branchName]?.analysis;
  const combined = [delivery, capture]
    .filter(Boolean)
    .join('\n\n---\n\n');

  const severity = maxSeverity([
    extractSeverity(delivery),
    extractSeverity(capture),
  ]);

  return {
    severity,
    analysis: combined || 'Ecosystem risk analysis unavailable.',
  };
}

function buildMockRiskBundle(branchName) {
  const creation = mockValueCreationRisks[branchName] || {};

  const financialAnalysis = creation.financialViability || `Financial analysis unavailable for ${branchName}.`;
  const technicalAnalysis = creation.technicalFeasibility || `Technical analysis unavailable for ${branchName}.`;
  const organizationalAnalysis = creation.organizationalCapability || `Organizational analysis unavailable for ${branchName}.`;
  const ecosystemAnalysis = buildEcosystemAnalysis(branchName);

  return {
    financial: {
      severity: extractSeverity(financialAnalysis),
      analysis: financialAnalysis,
    },
    technical: {
      severity: extractSeverity(technicalAnalysis),
      analysis: technicalAnalysis,
    },
    organizational: {
      severity: extractSeverity(organizationalAnalysis),
      analysis: organizationalAnalysis,
    },
    ecosystem: ecosystemAnalysis,
  };
}

export const mockRiskAnalyses = Object.fromEntries(
  mockBranches.map(({ name }) => {
    const bundle = buildMockRiskBundle(name);
    return [name, {
      financial: bundle.financial.analysis,
      technical: bundle.technical.analysis,
      organizational: bundle.organizational.analysis,
      ecosystem: bundle.ecosystem.analysis,
    }];
  })
);

export const mockRiskLevels = Object.fromEntries(
  mockBranches.map(({ name }) => {
    const bundle = buildMockRiskBundle(name);
    const dimensions = {
      financial: bundle.financial.severity,
      technical: bundle.technical.severity,
      organizational: bundle.organizational.severity,
      ecosystem: bundle.ecosystem.severity,
    };

    const level = Object.values(dimensions).reduce((current, levelValue) => {
      if (SEVERITY_ORDER[levelValue] > SEVERITY_ORDER[current]) {
        return levelValue;
      }
      return current;
    }, 'LOW');

    const reasoning = `Financial risk is ${dimensions.financial}, technical risk is ${dimensions.technical}, organizational risk is ${dimensions.organizational}, and ecosystem risk is ${dimensions.ecosystem}.`;

    const mitigation = Object.entries(dimensions)
      .sort((a, b) => SEVERITY_ORDER[b[1]] - SEVERITY_ORDER[a[1]])
      .slice(0, 3)
      .map(([dimension]) => PRIMARY_MITIGATIONS[dimension]);

    return [name, { dimensions, level, reasoning, mitigation }];
  })
);

function resolveSeverity(input, fallback) {
  if (!input && fallback) return fallback;
  if (typeof input === 'string') {
    const normalized = input.toUpperCase();
    return SEVERITY_ORDER[normalized] !== undefined ? normalized : fallback;
  }
  if (input && typeof input === 'object' && typeof input.severity === 'string') {
    const normalized = input.severity.toUpperCase();
    return SEVERITY_ORDER[normalized] !== undefined ? normalized : fallback;
  }
  return fallback;
}

/**
 * Simulates a delay to mimic API latency
 */
async function delay(ms = 800) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mock versions of the API functions
 */
export async function mockSetContext(fileContent) {
  await delay(500);
  return mockContext;
}

export async function mockIdentifyDecisionBranches(context) {
  await delay(1000);
  return mockBranches;
}

export async function mockAnalyzeFinancialRisk(context, branchName) {
  await delay(400);
  return buildMockRiskBundle(branchName).financial;
}

export async function mockAnalyzeTechnicalRisk(context, branchName) {
  await delay(400);
  return buildMockRiskBundle(branchName).technical;
}

export async function mockAnalyzeOrganizationalRisk(context, branchName) {
  await delay(400);
  return buildMockRiskBundle(branchName).organizational;
}

export async function mockAnalyzeEcosystemRisk(context, branchName) {
  await delay(400);
  return buildMockRiskBundle(branchName).ecosystem;
}

export async function mockDetermineRiskLevel(context, branchName, riskAnalyses = {}) {
  await delay(500);

  const bundle = buildMockRiskBundle(branchName);

  const dimensions = {
    financial: resolveSeverity(riskAnalyses.financial, bundle.financial.severity) || DEFAULT_SEVERITY,
    technical: resolveSeverity(riskAnalyses.technical, bundle.technical.severity) || DEFAULT_SEVERITY,
    organizational: resolveSeverity(riskAnalyses.organizational, bundle.organizational.severity) || DEFAULT_SEVERITY,
    ecosystem: resolveSeverity(riskAnalyses.ecosystem, bundle.ecosystem.severity) || DEFAULT_SEVERITY,
  };

  const level = Object.values(dimensions).reduce((current, next) => {
    if (SEVERITY_ORDER[next] > SEVERITY_ORDER[current]) {
      return next;
    }
    return current;
  }, 'LOW');

  const reasoning = `Financial risk is ${dimensions.financial}, technical risk is ${dimensions.technical}, organizational risk is ${dimensions.organizational}, and ecosystem risk is ${dimensions.ecosystem}.`;

  const mitigation = Object.entries(dimensions)
    .sort((a, b) => SEVERITY_ORDER[b[1]] - SEVERITY_ORDER[a[1]])
    .slice(0, 3)
    .map(([dimension]) => PRIMARY_MITIGATIONS[dimension]);

  return {
    dimensions,
    level,
    reasoning,
    mitigation,
  };
}

function buildMockDecisionTimeline(startYear = DEFAULT_DECISION_YEAR) {
  const baseYear = Number.isFinite(startYear) ? startYear : DEFAULT_DECISION_YEAR;

  return [
    {
      sequence: 1,
      year: baseYear,
      quarter: 'Q1',
      decision: 'Lock Core Patent Positions',
      description: 'File priority patents and conduct freedom-to-operate reviews across key jurisdictions to secure defensibility before scale investments.',
      linkedRisk: {
        branch: 'Patent and IP Strategy',
        riskDimension: 'Ecosystem',
        severity: 'MEDIUM',
        riskStatement: 'Weak IP coverage invites fast-follower competition and erodes ecosystem leverage.'
      },
      mitigationRationale: 'Aggressive filing and diligence convert the ecosystem exposure into enforceable barriers, deterring the fast-follow threat identified in the risk analysis.'
    },
    {
      sequence: 2,
      year: baseYear,
      quarter: 'Q2',
      decision: 'Stand Up EMS Manufacturing Pilot',
      description: 'Launch a co-funded pilot line with two EMS partners to validate yields and ramp know-how without heavy capex.',
      linkedRisk: {
        branch: 'Manufacturing Scale-Up',
        riskDimension: 'Financial',
        severity: 'HIGH',
        riskStatement: 'Capital-intensive captive scale-up risks exhausting cash before revenues materialize.'
      },
      mitigationRationale: 'Sharing investment with EMS partners phases the cash outlay and keeps burn aligned to milestones, directly reducing the highlighted financial exposure.'
    },
    {
      sequence: 3,
      year: baseYear,
      quarter: 'Q3',
      decision: 'Secure Anchor OEM Commitments',
      description: 'Close co-development agreements with two signage OEMs complete with volume triggers and integration support.',
      linkedRisk: {
        branch: 'Market Sequencing',
        riskDimension: 'Ecosystem',
        severity: 'HIGH',
        riskStatement: 'Without early demand validation, partner adoption remains uncertain and delays market entry.'
      },
      mitigationRationale: 'Binding OEM commitments de-risk the adoption bottleneck by underwriting demand that unlocks upstream partner investment.'
    },
    {
      sequence: 4,
      year: baseYear + 1,
      quarter: 'Q1',
      decision: 'Operationalize Manufacturing Governance',
      description: 'Install a manufacturing PMO, SPC dashboards, and layered process audits to control scale-up execution.',
      linkedRisk: {
        branch: 'Manufacturing Scale-Up',
        riskDimension: 'Organizational',
        severity: 'MEDIUM',
        riskStatement: 'Limited high-volume operations muscle threatens quality and schedule adherence.'
      },
      mitigationRationale: 'Dedicated governance and process controls import the missing organizational capabilities flagged in the risk review.'
    },
    {
      sequence: 5,
      year: baseYear + 1,
      quarter: 'Q3',
      decision: 'Stage Series B Funding Gate',
      description: 'Raise capital against validated yield and customer milestones with a deployment plan tied to expansion phases.',
      linkedRisk: {
        branch: 'Funding and Resource Allocation',
        riskDimension: 'Financial',
        severity: 'HIGH',
        riskStatement: 'Runway compression from scale-up burn could stall execution without staged capital infusions.'
      },
      mitigationRationale: 'Milestone-based fundraising times cash inflows with proof points, preventing the runway cliff flagged in the financial risk assessment.'
    }
  ];
}

function buildMockRoadmapRecommendations(startYear = DEFAULT_DECISION_YEAR) {
  return {
    executiveSummary: `E Ink faces a critical inflection point with five HIGH-risk pathways and one MEDIUM-risk option. The analysis reveals that success requires careful sequencing: prioritize Patent IP protection (lowest risk) to establish defensibility, then pursue staged Manufacturing Scale-Up with EMS partnerships to minimize capital exposure. Market entry should target retail signage first (Phase I validation) before expanding to consumer electronics. Defer Technology Platform Evolution until core manufacturing and initial market traction are proven.

Key insight: All pathways face severe interdependence risks (17-36% joint partner success probabilities) and extended adoption timelines (24-72 months). The recommended approach balances capability building, risk mitigation, and capital efficiency while maintaining strategic optionality.`,

    decisionTimeline: buildMockDecisionTimeline(startYear),

    prioritizedOptions: [
      {
        priority: 1,
        name: 'Patent and IP Strategy',
        rationale: 'Lowest overall risk (MEDIUM) with manageable costs and minimal dependencies. Establishes competitive moat before market entry. 2-5 year patent prosecution timeline aligns with product development cycles.',
        timeline: 'Immediate start, 24-36 months to core portfolio'
      },
      {
        priority: 2,
        name: 'Manufacturing Scale-Up (Staged)',
        rationale: 'Critical enabler for market entry. Adopt EMS partnership model to reduce capital requirements from $20M+ to $5-8M. Stage investments with clear milestones to manage 36% joint success probability.',
        timeline: 'Begin 12 months, 18-24 month execution'
      },
      {
        priority: 3,
        name: 'Market Sequencing (Phase I Focus)',
        rationale: 'Retail signage offers fastest path to revenue with clearest value proposition. Use as validation before pursuing higher-risk consumer electronics. Limits initial market risk while building credibility.',
        timeline: 'Initiate 18-24 months, Phase I completion 36 months'
      }
    ],

    actionItems: [
      {
        title: 'Secure Patent Portfolio Foundation',
        description: 'File core patents covering microcapsule technology, manufacturing processes, and key applications. Prioritize USPTO, EPO, and Asian jurisdictions.',
        owner: 'CTO + Patent Counsel',
        timeframe: `Q1-Q2 ${startYear}`
      },
      {
        title: 'Negotiate EMS Partnership Agreement',
        description: 'Identify and engage 2-3 qualified contract manufacturers. Structure deal with milestone payments and joint development to align incentives.',
        owner: 'VP Operations',
        timeframe: `Q2-Q3 ${startYear}`
      },
      {
        title: 'Launch Anchor Customer Program',
        description: 'Secure 1-2 key OEM partners for co-development in retail signage. Offer exclusivity window in exchange for volume commitments and market validation.',
        owner: 'VP Business Development',
        timeframe: `Q3-Q4 ${startYear}`
      },
      {
        title: 'Establish Staged Funding Gates',
        description: 'Define clear technical and commercial milestones for Series B/C rounds. Align board on go/no-go criteria and contingency plans.',
        owner: 'CFO + CEO',
        timeframe: `Q1 ${startYear}`
      }
    ],

    riskMitigationPriorities: [
      {
        area: 'Partner Interdependence Risk',
        action: 'Develop dual-source strategies for critical materials and equipment. Build contractual safeguards with milestone-based payments and performance penalties.'
      },
      {
        area: 'Capital Efficiency',
        action: 'Pursue EMS model over captive manufacturing. Target $5-8M initial scale-up vs. $20M+ for owned facilities. Preserves optionality and reduces cash burn.'
      },
      {
        area: 'Market Validation Risk',
        action: 'Focus Phase I on retail signage with 2-3 anchor customers before broader launch. Validate demand and reliability at scale before heavy investment in Phases II-III.'
      },
      {
        area: 'Technical Execution',
        action: 'Hire VP Manufacturing Operations with high-volume experience. Invest in process engineering talent. Stage technology development with strict prototype validation gates.'
      }
    ],

    successMetrics: [
      {
        name: 'Patent Portfolio Strength',
        description: 'Core patent families filed and prosecuted in key jurisdictions',
        target: '8-12 granted patents by Month 36'
      },
      {
        name: 'Manufacturing Yield Rate',
        description: 'Production yield for scaled manufacturing processes',
        target: '70%+ yield by Month 24, 90%+ by Month 36'
      },
      {
        name: 'Customer Commitments',
        description: 'Binding purchase agreements or MOUs from anchor customers',
        target: '$10M+ committed ARR by Month 30'
      },
      {
        name: 'Capital Efficiency',
        description: 'Burn rate management and runway extension',
        target: 'Maintain 18+ month runway; <$1.2M monthly burn'
      }
    ],

    nextSteps: [
      'Engage patent counsel and initiate FTO analysis within 30 days',
      'Develop detailed Manufacturing Scale-Up business case comparing captive vs. EMS models',
      'Create target customer list for retail signage and initiate outreach',
      'Establish quarterly board milestones with clear funding gate criteria',
      'Hire VP Manufacturing Operations to lead scale-up execution',
      'Defer Technology Platform Evolution and Phases II-III investment until Phase I validation complete'
    ]
  };
}

export const mockRoadmapRecommendations = buildMockRoadmapRecommendations(DEFAULT_DECISION_YEAR);

export async function mockGenerateRoadmapRecommendations(context, branches, decisionYear) {
  await delay(1500);
  const startYear = Number.isFinite(decisionYear) ? decisionYear : DEFAULT_DECISION_YEAR;
  return buildMockRoadmapRecommendations(startYear);
}

