
export const mockHypotheses = [
    {
        id: 1,
        text: "Users are struggling with manual data entry in their current workflow.",
        status: 'verified',
        supportingEvidence: 6,
        againstEvidence: 1,
        confidence: 0.85,
        evidence: [
            { type: 'supporting', quote: "I spend about 20% of my week just tagging interviews.", source: "Sarah Miller, AppFolio" },
            { type: 'supporting', quote: "They spend hours transcribing and not enough time analyzing.", source: "Dr. Emily Chen, UCSB" },
        ]
    },
    {
        id: 2,
        text: "Integration with Jira is a critical requirement for adoption.",
        status: 'unverified',
        supportingEvidence: 2,
        againstEvidence: 3,
        confidence: 0.4,
        evidence: []
    },
    {
        id: 3,
        text: "Teams struggle to make sense of scattered insights from long recordings and messy transcripts.",
        status: 'verified',
        supportingEvidence: 7,
        againstEvidence: 2,
        confidence: 0.85,
        evidence: [
            { type: 'supporting', quote: "We have recordings all over the place - Zoom, Gong, Google Drive. It's a mess.", source: "Mark Johnson, Procore" },
            { type: 'supporting', quote: "We usually just give up and go with our gut.", source: "Mark Johnson, Procore" },
            { type: 'refuting', quote: "We use Dovetail, but it's manual.", source: "Lisa Wong, Invoca" },
        ]
    },
    {
        id: 4,
        text: "Unclear and slow extraction of insights leads to products that don't fully meet customer needs.",
        status: 'verified',
        supportingEvidence: 4,
        againstEvidence: 1,
        confidence: 0.75,
        evidence: [
            { type: 'supporting', quote: "We launch features that miss the mark because we didn't connect the dots from three different interviews.", source: "David Kim, Sonos" },
        ]
    },
    {
        id: 5,
        text: "Users prefer AI-assisted tagging over fully manual categorization.",
        status: 'unverified',
        supportingEvidence: 5,
        againstEvidence: 1,
        confidence: 0.8,
        evidence: [
            { type: 'supporting', quote: "If InsightStream can auto-tag and auto-cluster themes, I'd switch in a heartbeat.", source: "Lisa Wong, Invoca" },
            { type: 'supporting', quote: "A neutral AI tool that extracts themes objectively would be very valuable.", source: "Prof. Michael Brown, Westmont" },
        ]
    }
];

export const mockInterviews = [
    {
        id: '1',
        interviewee: 'Dr. Emily Chen',
        role: 'Professor of Entrepreneurship',
        company: 'UCSB',
        date: '2023-11-01',
        duration: '45:00',
        interviewer: 'Julie Vang',
        status: 'Completed',
        transcript: "Julie: Dr. Chen, thanks for meeting. I'm interested in how your students handle the customer discovery phase.\n\nDr. Chen: It's one of the biggest hurdles. Teaching students to do customer discovery is hard because they get overwhelmed by the data. They go out and do 20 interviews, which is great, but then they come back with 20 hours of audio.\n\nJulie: How do they process it currently?\n\nDr. Chen: They don't, really. They spend hours transcribing and not enough time analyzing. They'll transcribe the first two, realize it takes forever, and then just rely on their memory for the rest. That leads to bias. If there was a tool to speed that up, it would be a game changer for my curriculum. I need them to focus on the insights, not the typing.",
        summary: "Dr. Chen highlights the educational bottleneck of manual transcription and analysis, validating the time-consuming nature of the process.",
        themes: ['Education', 'Time Efficiency', 'Analysis Paralysis'],
        sentiment: 'Positive'
    },
    {
        id: '2',
        interviewee: 'Mark Johnson',
        role: 'Senior PM',
        company: 'Procore',
        date: '2023-11-02',
        duration: '30:00',
        interviewer: 'Ty Case',
        status: 'Completed',
        transcript: "Ty: Mark, walk me through your current repository for user research.\n\nMark: Repository? That's a generous word. We have recordings all over the place - Zoom, Gong, Google Drive. It's a mess. When we need to find that one quote about the mobile app, it's a nightmare. I know I heard a customer say it, but I can't remember which file it's in.\n\nTy: So what happens when you can't find it?\n\nMark: We usually just give up and go with our gut. Or we waste an hour slacking people asking 'Hey, do you remember who said that thing about offline mode?' It's inefficient. We need a central search bar for everything.",
        summary: "Mark confirms the 'scattered insights' hypothesis, noting that data fragmentation leads to gut-based decisions rather than data-driven ones.",
        themes: ['Data Fragmentation', 'Searchability', 'Decision Making'],
        sentiment: 'Negative'
    },
    {
        id: '3',
        interviewee: 'Sarah Miller',
        role: 'Product Lead',
        company: 'AppFolio',
        date: '2023-11-03',
        duration: '50:00',
        interviewer: 'Chinmaiye Gandhi',
        status: 'Completed',
        transcript: "Chinmaiye: Sarah, how much time are you spending on this manually?\n\nSarah: Too much. I spend about 20% of my week just tagging interviews. I sit there with a spreadsheet open, listening to calls at 2x speed, pausing, typing, tagging. It's not the best use of my time.\n\nChinmaiye: That sounds tedious.\n\nSarah: It is. I'm a Product Lead, I need to be strategizing, not doing data entry. But if I don't do it, nobody will. Automation here is overdue. If you can give me back those 8 hours a week, I'd pay a lot for that.",
        summary: "Sarah validates the time-consuming hypothesis, quantifying the wasted time at 20% of her week.",
        themes: ['Efficiency', 'Automation', 'Role Focus'],
        sentiment: 'Neutral'
    },
    {
        id: '4',
        interviewee: 'David Kim',
        role: 'VP of Product',
        company: 'Sonos',
        date: '2023-11-04',
        duration: '60:00',
        interviewer: 'Uma Kamath',
        status: 'Completed',
        transcript: "Uma: David, at your scale, what's the biggest challenge with user feedback?\n\nDavid: The problem isn't gathering data, it's synthesizing it. We have plenty of data. But we launch features that miss the mark because we didn't connect the dots from three different interviews.\n\nUma: Can you give an example?\n\nDavid: Sure. One customer mentioned a connectivity issue in the bedroom. Another mentioned it in the garage. A third mentioned it on the patio. Separately, they looked like edge cases. Together, they pointed to a range issue. We missed it. We need a 'brain' that connects them for us.",
        summary: "David supports the hypothesis that slow/unclear extraction leads to poor product fit. He emphasizes the need for synthesis over just collection.",
        themes: ['Synthesis', 'Product Fit', 'AI Insights'],
        sentiment: 'Negative'
    },
    {
        id: '5',
        interviewee: 'Prof. Michael Brown',
        role: 'Adjunct Professor',
        company: 'Westmont College',
        date: '2023-11-05',
        duration: '40:00',
        interviewer: 'Julie Vang',
        status: 'Completed',
        transcript: "Julie: Professor, you mentioned bias earlier. Can you elaborate?\n\nProf. Brown: My students struggle with bias. They hear what they want to hear. They go into an interview loving their idea, and they filter out anything that contradicts it.\n\nJulie: How do you grade them on that?\n\nProf. Brown: It's hard without listening to every minute. A neutral AI tool that extracts themes objectively would be very valuable for teaching unbiased validation. If the AI says 'The sentiment was negative,' it forces the student to confront that reality.",
        summary: "Prof. Brown brings up a new angle: bias reduction. He sees value in AI for objective theme extraction.",
        themes: ['Bias', 'Objectivity', 'Education'],
        sentiment: 'Positive'
    },
    {
        id: '6',
        interviewee: 'Lisa Wong',
        role: 'Product Manager',
        company: 'Invoca',
        date: '2023-11-06',
        duration: '35:00',
        interviewer: 'Ty Case',
        status: 'Completed',
        transcript: "Ty: Lisa, are you using any tools for this today?\n\nLisa: We use Dovetail, but it's manual. You still have to highlight and tag everything yourself. It's basically a fancy highlighter.\n\nTy: So it doesn't save you time?\n\nLisa: It organizes things, but it doesn't save the time of actually processing the content. If InsightStream can auto-tag and auto-cluster themes, I'd switch in a heartbeat. The manual tagging is the bottleneck. I have a backlog of 15 interviews I haven't even tagged yet because I dread it.",
        summary: "Lisa compares with Dovetail, confirming that manual tagging is the primary pain point she wants solved.",
        themes: ['Competitors', 'Automation', 'Tagging'],
        sentiment: 'Positive'
    },
    {
        id: '7',
        interviewee: 'James Wilson',
        role: 'Director of PM',
        company: 'LogicMonitor',
        date: '2023-11-07',
        duration: '45:00',
        interviewer: 'Chinmaiye Gandhi',
        status: 'Processing',
        transcript: "Processing...",
        summary: "Pending analysis...",
        themes: [],
        sentiment: ''
    },
    {
        id: '8',
        interviewee: 'Rachel Green',
        role: 'Senior PM',
        company: 'WellHealth',
        date: '2023-11-08',
        duration: '30:00',
        interviewer: 'Uma Kamath',
        status: 'Scheduled',
        transcript: "",
        summary: "",
        themes: [],
        sentiment: ''
    },
    {
        id: '9',
        interviewee: 'Tom Haverford',
        role: 'Founder',
        company: 'SB Startups',
        date: '2023-11-09',
        duration: '25:00',
        interviewer: 'Julie Vang',
        status: 'Completed',
        transcript: "Julie: Tom, as a founder, you're doing everything. How do you manage customer feedback?\n\nTom: I talk to 5 customers a day. I can't remember everything. I need a searchable database of my conversations. I'll be in the shower and think 'Wait, what did the guy from last Tuesday say about pricing?'\n\nJulie: And you can't find it?\n\nTom: I have to dig through my notes, check my calendar to see who it was... it's a pain. I need to answer that instantly. I want to just type 'pricing' and see every conversation about it.",
        summary: "Tom emphasizes the need for searchability and memory aid for high-volume customer interactions.",
        themes: ['Memory', 'Searchability', 'Volume'],
        sentiment: 'Neutral'
    },
    {
        id: '10',
        interviewee: 'Donna Meagle',
        role: 'UX Researcher',
        company: 'TechStyle',
        date: '2023-11-10',
        duration: '55:00',
        interviewer: 'Ty Case',
        status: 'Completed',
        transcript: "Ty: Donna, how does the handoff between UX and Product work at TechStyle?\n\nDonna: It's friction-full. Designers and PMs speak different languages. I produce these detailed research reports, and the PMs just skim them.\n\nTy: Why do you think that is?\n\nDonna: They want the 'so what' immediately. We need a tool that translates user needs into PM requirements. If this tool bridges that gap, it's a winner. It needs to take the raw empathy of the user interview and turn it into actionable tickets.",
        summary: "Donna suggests the tool could bridge the gap between UX and PM vocabularies.",
        themes: ['Collaboration', 'Translation', 'UX/PM Alignment'],
        sentiment: 'Positive'
    }
];

export const mockTrends = [
    { name: 'Time Efficiency', count: 18 },
    { name: 'Data Fragmentation', count: 15 },
    { name: 'Synthesis', count: 12 },
    { name: 'Automation', count: 10 },
    { name: 'Bias Reduction', count: 5 },
];

export const mockStats = {
    completed: 8,
    inProgress: 1,
    scheduled: 1,
};

export const mockDemographics = {
    'Product Managers': 50,
    'Professors': 20,
    'Founders': 10,
    'UX Researchers': 10,
    'VP/Director': 10,
};

export const mockAgeDistribution = {
    '20-29': 20,
    '30-39': 50,
    '40-49': 20,
    '50+': 10,
};

export const mockGenderDistribution = {
    'Female': 50,
    'Male': 40,
    'Non-binary': 5,
    'Prefer not to say': 5,
};

export const mockGenerateSummary = async (transcript) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("This is a mock summary generated for the provided transcript. It highlights key pain points and opportunities mentioned by the interviewee.");
        }, 1000);
    });
};

export const mockExtractThemes = async (transcript) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(['Mock Theme 1', 'Mock Theme 2', 'Mock Theme 3']);
        }, 1000);
    });
};
