import { ChartColumnStacked, Table, TypeOutline } from "lucide-react";

export const domains = ["Airport", "Airline"];

export const categoryOptions = {
  Airport: ["ASP", "AEP", "ACM", "SMS", "ADFAP (Airport)"],
  Airline: ["ASP", "ADFP"],
};

export const existingProjects = [
  "ASP",
  "Materials",
  "Finance",
  "ADFAP (Airport)",
  "Safety Management"
]

export const mockCategories = [
  {
    id: "cat1",
    name: "Airport",
    templates: [
      {
        id: "temp1",
        category: "Safety",
        name: "ASP (Airport Safety Program)",
        questions: [
          {
            id: "q1",
            category: "Runway Safety",
            text: "What are the runway safety protocols?",
            answer: [
              {
                documentName: "Airport Safety Manual",
                page: "Page 15",
                answer:
                  "Runway safety protocols include mandatory safety management systems, regular inspections, and wildlife hazard management programs to ensure safe aircraft operations.",
              },
              {
                documentName: "ICAO Airport Standards",
                page: "Page 22",
                answer:
                  "Implementation of runway incursion prevention systems with advanced ground radar and automated conflict detection capabilities.",
              },
              {
                documentName: "FAA Advisory Circular",
                page: "Page 8",
                answer:
                  "Comprehensive safety protocols covering lighting systems, marking standards, and emergency response procedures for runway operations.",
              },
              {
                documentName: "Runway Safety Best Practices",
                page: "Page 41",
                answer:
                  "Enhanced runway safety measures including improved markings, lighting systems, and automated warning systems for enhanced visibility and safety.",
              },
              {
                documentName: "Wildlife Management Guidelines",
                page: "Page 17",
                answer:
                  "Comprehensive wildlife hazard management including habitat modification, deterrent systems, and wildlife strike reporting procedures.",
              },
            ],
          },
          {
            id: "q2",
            category: "Ground Operations",
            text: "What are the ground handling safety requirements?",
            answer: [
              {
                documentName: "Ground Operations Manual",
                page: "Page 31",
                answer:
                  "Ground handling operations require certified personnel training, equipment maintenance schedules, and adherence to IATA Ground Operations Manual standards.",
              },
              {
                documentName: "Safety Risk Assessment",
                page: "Page 12",
                answer:
                  "Mandatory risk assessments for all ground handling activities including baggage handling, aircraft servicing, and passenger boarding operations.",
              },
              {
                documentName: "Equipment Safety Standards",
                page: "Page 19",
                answer:
                  "All ground support equipment must meet international safety standards with regular certification and operator training requirements.",
              },
              {
                documentName: "Personnel Training Requirements",
                page: "Page 45",
                answer:
                  "Ground handling personnel must complete comprehensive safety training including equipment operation, hazard recognition, and emergency procedures.",
              },
            ],
          },
          {
            id: "q3",
            category: "Apron Safety",
            text: "What are the aircraft apron safety procedures?",
            answer: [
              {
                documentName: "Apron Safety Guidelines",
                page: "Page 28",
                answer:
                  "Apron safety procedures include designated walkways, vehicle traffic control, and personal protective equipment requirements for all personnel.",
              },
              {
                documentName: "Ground Traffic Management",
                page: "Page 33",
                answer:
                  "Systematic traffic control measures including vehicle permits, speed limits, and coordination with air traffic control for apron movements.",
              },
              {
                documentName: "Foreign Object Debris Prevention",
                page: "Page 15",
                answer:
                  "Regular FOD inspections and removal procedures to prevent aircraft damage from debris on apron and runway surfaces.",
              },
            ],
          },
          {
            id: "q4",
            category: "Training Programs",
            text: "What is the probability that a pilot chosen at random has completed safety training?",
            answer: [
              {
                documentName: "Training Curriculum Standards",
                page: "Page 52",
                answer:
                  "Mandatory safety training includes initial certification, annual recurrent training, and specialized training for specific job functions.",
              },
              {
                documentName: "Competency Assessment Framework",
                page: "Page 38",
                answer:
                  "Regular competency assessments ensure personnel maintain required safety knowledge and skills throughout their employment.",
              },
              {
                documentName: "Safety Culture Development",
                page: "Page 29",
                answer:
                  "Comprehensive safety culture programs promoting proactive safety reporting and continuous improvement initiatives.",
              },
            ],
          },
          {
            id: "q5",
            category: "Incident Management",
            text: "How are safety incidents investigated and reported?",
            answer: [
              {
                documentName: "Incident Investigation Procedures",
                page: "Page 67",
                answer:
                  "Systematic incident investigation methodology including evidence collection, root cause analysis, and corrective action implementation.",
              },
              {
                documentName: "Safety Reporting Systems",
                page: "Page 44",
                answer:
                  "Confidential safety reporting systems encouraging voluntary reporting of safety concerns and near-miss incidents.",
              },
              {
                documentName: "Regulatory Notification Requirements",
                page: "Page 23",
                answer:
                  "Immediate notification procedures for serious incidents and accidents to aviation authorities and relevant stakeholders.",
              },
            ],
          },
        ],
      },
      {
        id: "temp2",
        category: "Emergency Preparation",
        name: "AEP (Airport Emergency Preparedness)",
        questions: [
          {
            id: "q1",
            category: "Emergency Response",
            text: "What are the emergency response procedures?",
            answer: [
              {
                documentName: "Emergency Response Plan",
                page: "Page 5",
                answer:
                  "Comprehensive emergency response procedures including aircraft rescue and firefighting, medical emergency protocols, and coordination with local authorities.",
              },
              {
                documentName: "Crisis Management Manual",
                page: "Page 18",
                answer:
                  "Multi-level emergency response system with clear command structures, communication protocols, and resource allocation procedures.",
              },
              {
                documentName: "ICAO Emergency Planning",
                page: "Page 24",
                answer:
                  "International standards for airport emergency planning including regular drills, equipment maintenance, and staff training requirements.",
              },
              {
                documentName: "Incident Command System",
                page: "Page 42",
                answer:
                  "Standardized incident command system ensuring effective coordination between airport personnel, emergency services, and external agencies.",
              },
            ],
          },
          {
            id: "q2",
            category: "Personnel Training",
            text: "What training is required for emergency personnel?",
            answer: [
              {
                documentName: "Training Requirements Manual",
                page: "Page 14",
                answer:
                  "Emergency personnel must complete specialized training in aircraft rescue, firefighting techniques, hazardous materials handling, and first aid certification.",
              },
              {
                documentName: "Certification Standards",
                page: "Page 27",
                answer:
                  "Annual recertification requirements with practical exercises, theoretical knowledge testing, and equipment proficiency demonstrations.",
              },
              {
                documentName: "International Training Standards",
                page: "Page 11",
                answer:
                  "Compliance with ICAO Annex 14 training standards and local regulatory requirements for emergency response personnel.",
              },
              {
                documentName: "Specialized Equipment Training",
                page: "Page 58",
                answer:
                  "Comprehensive training on emergency equipment including aircraft rescue and firefighting vehicles, foam systems, and specialized rescue tools.",
              },
            ],
          },
          {
            id: "q3",
            category: "ARFF Operations",
            text: "What are the aircraft rescue and firefighting requirements?",
            answer: [
              {
                documentName: "ARFF Operations Manual",
                page: "Page 35",
                answer:
                  "Aircraft rescue and firefighting operations require specialized vehicles, trained personnel, and rapid response capabilities based on airport category.",
              },
              {
                documentName: "Equipment Specifications",
                page: "Page 71",
                answer:
                  "ARFF vehicles must meet specific performance criteria including water capacity, foam concentrate, and response time requirements.",
              },
              {
                documentName: "Response Time Standards",
                page: "Page 19",
                answer:
                  "Emergency response times must not exceed 3 minutes to any point on the runway or 4 minutes to any point within the airport perimeter.",
              },
            ],
          },
          {
            id: "q4",
            category: "Communications",
            text: "How are emergency communications managed?",
            answer: [
              {
                documentName: "Emergency Communications Protocol",
                page: "Page 26",
                answer:
                  "Emergency communications utilize dedicated frequencies, backup systems, and coordination with air traffic control and external agencies.",
              },
              {
                documentName: "Communication Equipment Standards",
                page: "Page 48",
                answer:
                  "Redundant communication systems ensure reliable connectivity during emergencies including radio, telephone, and digital communication platforms.",
              },
              {
                documentName: "Multi-Agency Coordination",
                page: "Page 33",
                answer:
                  "Established communication protocols for coordination with police, fire department, medical services, and other emergency responders.",
              },
            ],
          },
          {
            id: "q5",
            category: "Medical Emergency",
            text: "What medical emergency facilities are required?",
            answer: [
              {
                documentName: "Medical Emergency Procedures",
                page: "Page 41",
                answer:
                  "Airport medical facilities must include first aid stations, emergency medical equipment, and coordination with local hospitals and emergency medical services.",
              },
              {
                documentName: "Medical Equipment Standards",
                page: "Page 29",
                answer:
                  "Required medical equipment includes defibrillators, oxygen supplies, trauma kits, and specialized equipment for aircraft-related injuries.",
              },
              {
                documentName: "Medical Personnel Requirements",
                page: "Page 16",
                answer:
                  "Medical emergency response requires trained medical personnel or arrangements with local emergency medical services for immediate response.",
              },
            ],
          },
        ],
      },
      {
        id: "temp3",
        category: "Capacity Management",
        name: "ACM (Airport Capacity Management)",
        questions: [
          {
            id: "q1",
            category: "Capacity Analysis",
            text: "How is airport capacity calculated?",
            answer: [
              {
                documentName: "Capacity Analysis Report",
                page: "Page 9",
                answer:
                  "Airport capacity calculation considers runway throughput, terminal processing rates, airspace constraints, and ground infrastructure limitations.",
              },
              {
                documentName: "Traffic Flow Management",
                page: "Page 16",
                answer:
                  "Utilization of advanced modeling tools and historical data analysis to determine optimal capacity under various weather and operational conditions.",
              },
              {
                documentName: "IATA Capacity Guidelines",
                page: "Page 23",
                answer:
                  "International best practices for capacity management including peak hour analysis, delay minimization strategies, and resource optimization.",
              },
              {
                documentName: "Runway Capacity Modeling",
                page: "Page 54",
                answer:
                  "Mathematical models considering aircraft mix, separation requirements, and meteorological conditions to determine maximum runway throughput.",
              },
            ],
          },
          {
            id: "q2",
            category: "Terminal Operations",
            text: "What factors affect terminal capacity?",
            answer: [
              {
                documentName: "Terminal Operations Analysis",
                page: "Page 32",
                answer:
                  "Terminal capacity depends on check-in facilities, security screening throughput, gate availability, and passenger processing systems efficiency.",
              },
              {
                documentName: "Passenger Flow Optimization",
                page: "Page 47",
                answer:
                  "Optimization of passenger flow through terminal design, queue management systems, and technology integration for enhanced processing efficiency.",
              },
              {
                documentName: "Baggage Handling Capacity",
                page: "Page 61",
                answer:
                  "Baggage handling system capacity affects overall terminal throughput including sorting systems, conveyor capacity, and claim area efficiency.",
              },
            ],
          },
          {
            id: "q3",
            category: "Airspace Management",
            text: "How is airspace capacity managed?",
            answer: [
              {
                documentName: "Airspace Management Procedures",
                page: "Page 28",
                answer:
                  "Airspace capacity management involves coordination with air traffic control, implementation of arrival and departure procedures, and noise abatement measures.",
              },
              {
                documentName: "Air Traffic Flow Management",
                page: "Page 43",
                answer:
                  "Strategic air traffic flow management including slot allocation, ground delay programs, and coordination with adjacent facilities.",
              },
              {
                documentName: "Approach and Departure Optimization",
                page: "Page 36",
                answer:
                  "Optimization of approach and departure procedures to maximize airspace utilization while maintaining safety separation requirements.",
              },
            ],
          },
          {
            id: "q4",
            category: "Infrastructure Development",
            text: "What are capacity enhancement strategies?",
            answer: [
              {
                documentName: "Infrastructure Development Plan",
                page: "Page 75",
                answer:
                  "Capacity enhancement through infrastructure development including additional runways, terminal expansion, and technology upgrades.",
              },
              {
                documentName: "Operational Efficiency Improvements",
                page: "Page 52",
                answer:
                  "Operational improvements including advanced air traffic management systems, collaborative decision making, and predictive analytics.",
              },
              {
                documentName: "Technology Integration",
                page: "Page 68",
                answer:
                  "Integration of advanced technologies including artificial intelligence, machine learning, and automated systems for capacity optimization.",
              },
            ],
          },
        ],
      },
      {
        id: "temp4",
        category: "Safety",
        name: "SMS (Safety Management System)",
        questions: [
          {
            id: "q1",
            category: "SMS Implementation",
            text: "What are the SMS implementation requirements?",
            answer: [
              {
                documentName: "SMS Implementation Guide",
                page: "Page 7",
                answer:
                  "SMS implementation requires establishment of safety policy, risk management processes, safety assurance activities, and safety promotion programs.",
              },
              {
                documentName: "Regulatory Compliance Manual",
                page: "Page 20",
                answer:
                  "Compliance with ICAO Annex 19 SMS standards and local aviation authority requirements for systematic safety management.",
              },
              {
                documentName: "Safety Performance Indicators",
                page: "Page 13",
                answer:
                  "Development of key safety performance indicators with regular monitoring, trending analysis, and continuous improvement processes.",
              },
              {
                documentName: "SMS Documentation Requirements",
                page: "Page 45",
                answer:
                  "Comprehensive documentation including safety policy, procedures, training records, and safety performance monitoring data.",
              },
            ],
          },
          {
            id: "q2",
            category: "Risk Management",
            text: "How is safety risk management conducted?",
            answer: [
              {
                documentName: "Safety Risk Management Procedures",
                page: "Page 31",
                answer:
                  "Systematic approach to identifying, assessing, and mitigating safety risks through formal risk management processes and controls.",
              },
              {
                documentName: "Hazard Identification Methods",
                page: "Page 24",
                answer:
                  "Multiple hazard identification methods including safety reporting systems, safety audits, and proactive risk assessment techniques.",
              },
              {
                documentName: "Risk Assessment Matrix",
                page: "Page 18",
                answer:
                  "Standardized risk assessment matrix for evaluating probability and severity of identified hazards and determining appropriate risk controls.",
              },
            ],
          },
          {
            id: "q3",
            category: "Safety Assurance",
            text: "What are safety assurance activities?",
            answer: [
              {
                documentName: "Safety Assurance Framework",
                page: "Page 39",
                answer:
                  "Safety assurance activities include safety performance monitoring, management review, and continuous improvement of safety management processes.",
              },
              {
                documentName: "Safety Audit Procedures",
                page: "Page 56",
                answer:
                  "Regular safety audits and inspections to verify compliance with safety procedures and effectiveness of safety controls.",
              },
              {
                documentName: "Safety Performance Monitoring",
                page: "Page 42",
                answer:
                  "Continuous monitoring of safety performance indicators and trending analysis to identify potential safety issues and system deficiencies.",
              },
            ],
          },
          {
            id: "q4",
            category: "Safety Promotion",
            text: "How is safety promotion implemented?",
            answer: [
              {
                documentName: "Safety Promotion Strategy",
                page: "Page 27",
                answer:
                  "Safety promotion through training programs, safety communication, and fostering a positive safety culture throughout the organization.",
              },
              {
                documentName: "Safety Training Programs",
                page: "Page 48",
                answer:
                  "Comprehensive safety training including SMS awareness, hazard identification, and safety reporting for all personnel levels.",
              },
              {
                documentName: "Safety Culture Assessment",
                page: "Page 35",
                answer:
                  "Regular assessment of safety culture through surveys, interviews, and observation to identify areas for improvement.",
              },
            ],
          },
        ],
      },
      {
        id: "temp5",
        category: "Data Analytics",
        name: "ADFAP (Airport Data Flow and Analytics Program)",
        questions: [
          {
            id: "q1",
            category: "Analytics Capabilities",
            text: "What data analytics capabilities are available?",
            answer: [
              {
                documentName: "Data Analytics Framework",
                page: "Page 12",
                answer:
                  "Advanced analytics capabilities including passenger flow analysis, operational efficiency metrics, and predictive maintenance algorithms.",
              },
              {
                documentName: "Performance Monitoring System",
                page: "Page 25",
                answer:
                  "Real-time data collection and analysis for runway utilization, gate management, and resource allocation optimization.",
              },
              {
                documentName: "Business Intelligence Platform",
                page: "Page 18",
                answer:
                  "Integrated dashboard systems providing actionable insights for airport operations, capacity planning, and revenue optimization.",
              },
              {
                documentName: "Predictive Analytics Tools",
                page: "Page 63",
                answer:
                  "Machine learning algorithms for predictive maintenance, demand forecasting, and operational optimization based on historical data patterns.",
              },
            ],
          },
          {
            id: "q2",
            category: "Data Integration",
            text: "How is operational data integrated?",
            answer: [
              {
                documentName: "Data Integration Architecture",
                page: "Page 41",
                answer:
                  "Comprehensive data integration platform connecting flight operations, passenger services, ground handling, and maintenance systems.",
              },
              {
                documentName: "API Management System",
                page: "Page 37",
                answer:
                  "Standardized APIs enabling seamless data exchange between different operational systems and external partners.",
              },
              {
                documentName: "Data Quality Management",
                page: "Page 29",
                answer:
                  "Data quality assurance processes including validation, cleansing, and standardization to ensure reliable analytics and reporting.",
              },
            ],
          },
          {
            id: "q3",
            category: "Passenger Analytics",
            text: "What passenger analytics are available?",
            answer: [
              {
                documentName: "Passenger Analytics Suite",
                page: "Page 55",
                answer:
                  "Comprehensive passenger analytics including flow analysis, waiting times, satisfaction metrics, and service level optimization.",
              },
              {
                documentName: "Queue Management Analytics",
                page: "Page 34",
                answer:
                  "Real-time queue monitoring and optimization algorithms to minimize passenger waiting times and improve service efficiency.",
              },
              {
                documentName: "Revenue Analytics Platform",
                page: "Page 71",
                answer:
                  "Revenue optimization analytics including concession performance, parking utilization, and non-aeronautical revenue analysis.",
              },
            ],
          },
          {
            id: "q4",
            category: "Data Security",
            text: "How is data security and privacy maintained?",
            answer: [
              {
                documentName: "Data Security Framework",
                page: "Page 46",
                answer:
                  "Multi-layered security architecture including encryption, access controls, and audit trails to protect sensitive operational data.",
              },
              {
                documentName: "Privacy Protection Measures",
                page: "Page 52",
                answer:
                  "Privacy protection measures including data anonymization, consent management, and compliance with data protection regulations.",
              },
              {
                documentName: "Cybersecurity Protocols",
                page: "Page 38",
                answer:
                  "Comprehensive cybersecurity protocols including threat detection, incident response, and continuous security monitoring.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "cat2",
    name: "Airline",
    templates: [
      {
        id: "temp6",
        category: "Safety",
        name: "ASP (Airline Safety Program)",
        questions: [
          {
            id: "q1",
            category: "Flight Operations",
            text: "What are the flight safety protocols?",
            answer: [
              {
                documentName: "Flight Operations Manual",
                page: "Page 11",
                answer:
                  "Comprehensive flight safety protocols including pre-flight checks, weather assessment procedures, and crew resource management requirements.",
              },
              {
                documentName: "Safety Risk Management",
                page: "Page 28",
                answer:
                  "Systematic approach to identifying, assessing, and mitigating operational risks throughout all phases of flight operations.",
              },
              {
                documentName: "IATA Safety Standards",
                page: "Page 35",
                answer:
                  "Implementation of international safety standards including IOSA audit requirements and best practice recommendations.",
              },
              {
                documentName: "Standard Operating Procedures",
                page: "Page 64",
                answer:
                  "Detailed standard operating procedures for normal, abnormal, and emergency situations ensuring consistent and safe flight operations.",
              },
            ],
          },
          {
            id: "q2",
            category: "Maintenance Safety",
            text: "What maintenance safety requirements exist?",
            answer: [
              {
                documentName: "Maintenance Program Manual",
                page: "Page 19",
                answer:
                  "Aircraft maintenance must comply with manufacturer specifications, regulatory airworthiness requirements, and approved maintenance schedules.",
              },
              {
                documentName: "Quality Assurance Program",
                page: "Page 14",
                answer:
                  "Continuous monitoring of maintenance activities with independent quality audits and corrective action procedures.",
              },
              {
                documentName: "Regulatory Compliance Guide",
                page: "Page 22",
                answer:
                  "Adherence to aviation authority regulations including Part 145 maintenance organization requirements and personnel certification.",
              },
              {
                documentName: "Maintenance Safety Culture",
                page: "Page 47",
                answer:
                  "Development of strong maintenance safety culture through training, communication, and continuous improvement initiatives.",
              },
            ],
          },
          {
            id: "q3",
            category: "Crew Resource Management",
            text: "How is crew resource management implemented?",
            answer: [
              {
                documentName: "CRM Training Manual",
                page: "Page 33",
                answer:
                  "Comprehensive crew resource management training focusing on communication, decision-making, and teamwork skills for flight crews.",
              },
              {
                documentName: "Human Factors Guidelines",
                page: "Page 56",
                answer:
                  "Integration of human factors principles in operations to reduce human error and improve safety performance.",
              },
              {
                documentName: "Threat and Error Management",
                page: "Page 41",
                answer:
                  "Systematic approach to identifying and managing operational threats and errors to prevent accidents and incidents.",
              },
            ],
          },
          {
            id: "q4",
            category: "Cabin Safety",
            text: "What are the cabin safety requirements?",
            answer: [
              {
                documentName: "Cabin Safety Manual",
                page: "Page 25",
                answer:
                  "Comprehensive cabin safety procedures including emergency equipment checks, passenger briefings, and evacuation procedures.",
              },
              {
                documentName: "Emergency Equipment Standards",
                page: "Page 38",
                answer:
                  "Requirements for emergency equipment including life vests, oxygen systems, and evacuation slides with regular inspection schedules.",
              },
              {
                documentName: "Cabin Crew Training Requirements",
                page: "Page 52",
                answer:
                  "Mandatory training for cabin crew including safety procedures, first aid, and emergency response with annual recertification.",
              },
            ],
          },
          {
            id: "q5",
            category: "Incident Investigation",
            text: "How are safety incidents investigated?",
            answer: [
              {
                documentName: "Incident Investigation Procedures",
                page: "Page 69",
                answer:
                  "Systematic incident investigation methodology including immediate response, evidence preservation, and root cause analysis.",
              },
              {
                documentName: "Flight Data Analysis",
                page: "Page 44",
                answer:
                  "Utilization of flight data monitoring and analysis to identify potential safety issues and improve operational safety.",
              },
              {
                documentName: "Safety Reporting Culture",
                page: "Page 31",
                answer:
                  "Promotion of open safety reporting culture encouraging voluntary reporting of safety concerns and near-miss events.",
              },
            ],
          },
        ],
      },
      {
        id: "temp7",
        category: "Data Analytics",
        name: "ADFP (Airline Data Flow Program)",
        questions: [
          {
            id: "q1",
            category: "Data Management",
            text: "How is operational data managed?",
            answer: [
              {
                documentName: "Data Management Strategy",
                page: "Page 8",
                answer:
                  "Integrated data management system capturing flight operations, passenger services, maintenance records, and financial performance metrics.",
              },
              {
                documentName: "Analytics Platform Guide",
                page: "Page 21",
                answer:
                  "Advanced analytics for route optimization, fuel efficiency analysis, and predictive maintenance scheduling using machine learning algorithms.",
              },
              {
                documentName: "Performance Metrics Framework",
                page: "Page 16",
                answer:
                  "Key performance indicators including on-time performance, load factors, customer satisfaction scores, and operational efficiency measures.",
              },
              {
                documentName: "Real-time Data Processing",
                page: "Page 58",
                answer:
                  "Real-time data processing capabilities enabling immediate decision-making and operational adjustments based on current conditions.",
              },
            ],
          },
          {
            id: "q2",
            category: "Cybersecurity",
            text: "What are the data security requirements?",
            answer: [
              {
                documentName: "Cybersecurity Framework",
                page: "Page 13",
                answer:
                  "Multi-layered security architecture protecting passenger data, operational systems, and critical infrastructure from cyber threats.",
              },
              {
                documentName: "Data Protection Policy",
                page: "Page 26",
                answer:
                  "Compliance with international data protection regulations including GDPR, data encryption standards, and access control mechanisms.",
              },
              {
                documentName: "Incident Response Plan",
                page: "Page 31",
                answer:
                  "Comprehensive incident response procedures for data breaches, system failures, and security violations with regulatory reporting requirements.",
              },
              {
                documentName: "Security Monitoring Systems",
                page: "Page 49",
                answer:
                  "Continuous security monitoring and threat detection systems with automated alerting and response capabilities.",
              },
            ],
          },
          {
            id: "q3",
            category: "Flight Data Analytics",
            text: "How is flight data analyzed for optimization?",
            answer: [
              {
                documentName: "Flight Data Analytics",
                page: "Page 37",
                answer:
                  "Comprehensive flight data analysis including fuel consumption, route efficiency, and performance optimization using advanced analytics.",
              },
              {
                documentName: "Predictive Maintenance Analytics",
                page: "Page 54",
                answer:
                  "Predictive maintenance algorithms analyzing aircraft data to predict component failures and optimize maintenance schedules.",
              },
              {
                documentName: "Route Optimization Models",
                page: "Page 42",
                answer:
                  "Mathematical models for route optimization considering fuel costs, weather conditions, and air traffic constraints.",
              },
            ],
          },
          {
            id: "q4",
            category: "Customer Analytics",
            text: "What passenger data analytics are available?",
            answer: [
              {
                documentName: "Customer Analytics Platform",
                page: "Page 29",
                answer:
                  "Comprehensive customer analytics including booking patterns, satisfaction metrics, and loyalty program effectiveness analysis.",
              },
              {
                documentName: "Revenue Management Analytics",
                page: "Page 63",
                answer:
                  "Advanced revenue management analytics optimizing pricing strategies, capacity allocation, and ancillary revenue opportunities.",
              },
              {
                documentName: "Passenger Experience Analytics",
                page: "Page 45",
                answer:
                  "Analysis of passenger experience data including service quality, on-time performance impact, and satisfaction correlation analysis.",
              },
            ],
          },
          {
            id: "q5",
            category: "Enterprise Integration",
            text: "How is data integrated across airline operations?",
            answer: [
              {
                documentName: "Enterprise Data Architecture",
                page: "Page 72",
                answer:
                  "Enterprise-wide data architecture enabling seamless integration between flight operations, maintenance, customer service, and financial systems.",
              },
              {
                documentName: "API Integration Framework",
                page: "Page 51",
                answer:
                  "Standardized API framework enabling real-time data exchange with partners, suppliers, and regulatory authorities.",
              },
              {
                documentName: "Data Governance Framework",
                page: "Page 39",
                answer:
                  "Comprehensive data governance framework ensuring data quality, consistency, and compliance across all airline operations.",
              },
            ],
          },
        ],
      },
    ],
  },
];

export const mockExternalAnswers = [
  {
    id: "ext1",
    title: "Airport Operations Best Practices",
    content:
      "Comprehensive analysis of airport operational efficiency including passenger flow optimization, baggage handling systems, and ground traffic management protocols based on international aviation standards.",
    source: "ICAO Airport Planning Manual",
  },
  {
    id: "ext2",
    title: "Airline Safety Management Systems",
    content:
      "Detailed overview of airline safety management implementation including hazard identification processes, risk assessment methodologies, and safety performance monitoring frameworks.",
    source: "IATA Safety Management Manual",
  },
  {
    id: "ext3",
    title: "Aviation Regulatory Compliance",
    content:
      "Cross-referenced regulatory requirements covering both airport and airline operations including international standards, national regulations, and certification processes.",
    source: "FAA Advisory Circulars",
  },
  {
    id: "ext4",
    title: "Aviation Analytics and Data Intelligence",
    content:
      "AI-powered insights for aviation industry including predictive maintenance algorithms, passenger demand forecasting, and operational efficiency optimization strategies.",
    source: "Aviation AI Analytics Platform",
  },
  {
    id: "ext5",
    title: "Emergency Preparedness Guidelines",
    content:
      "Comprehensive emergency response procedures for both airport and airline operations including crisis management, evacuation protocols, and coordination with emergency services.",
    source: "Emergency Response Planning Guide",
  },
  {
    id: "ext6",
    title: "Capacity Management Solutions",
    content:
      "Advanced capacity planning methodologies for airports and airlines including demand forecasting, resource allocation, and infrastructure optimization strategies.",
    source: "Aviation Capacity Planning Institute",
  },
  {
    id: "ext7",
    title: "Runway Incursion Prevention Systems",
    content:
      "Advanced technology solutions for preventing runway incursions including ground radar systems, automated conflict detection, and pilot alerting systems for enhanced runway safety.",
    source: "Runway Safety Technology Review",
  },
  {
    id: "ext8",
    title: "Aircraft Maintenance Optimization",
    content:
      "Comprehensive maintenance optimization strategies including predictive maintenance, condition-based monitoring, and reliability-centered maintenance approaches for commercial aviation.",
    source: "Aviation Maintenance Best Practices",
  },
  {
    id: "ext9",
    title: "Passenger Experience Enhancement",
    content:
      "Innovative approaches to improving passenger experience including biometric processing, mobile technologies, and personalized services throughout the airport journey.",
    source: "Passenger Experience Innovation Report",
  },
  {
    id: "ext10",
    title: "Aviation Cybersecurity Framework",
    content:
      "Comprehensive cybersecurity framework for aviation industry addressing threats to operational technology, information systems, and passenger data protection.",
    source: "Aviation Cybersecurity Guidelines",
  },
  {
    id: "ext11",
    title: "Sustainable Aviation Operations",
    content:
      "Environmental sustainability initiatives for airports and airlines including carbon reduction strategies, sustainable fuel adoption, and green technology implementation.",
    source: "Sustainable Aviation Strategy Guide",
  },
  {
    id: "ext12",
    title: "Air Traffic Management Optimization",
    content:
      "Advanced air traffic management techniques including trajectory-based operations, collaborative decision making, and artificial intelligence applications for airspace optimization.",
    source: "NextGen Air Traffic Management",
  },
  {
    id: "ext13",
    title: "Ground Support Equipment Standards",
    content:
      "International standards and best practices for ground support equipment including maintenance requirements, safety protocols, and operator training standards.",
    source: "GSE Standards and Practices Manual",
  },
  {
    id: "ext14",
    title: "Aviation Weather Services",
    content:
      "Comprehensive weather services for aviation including meteorological data, forecasting accuracy, and weather impact on flight operations and airport capacity.",
    source: "Aviation Weather Services Guide",
  },
  {
    id: "ext15",
    title: "Airline Revenue Management",
    content:
      "Advanced revenue management techniques including dynamic pricing, demand forecasting, and capacity optimization for maximizing airline profitability.",
    source: "Revenue Management Best Practices",
  },
  {
    id: "ext16",
    title: "Airport Terminal Design Guidelines",
    content:
      "Comprehensive guidelines for airport terminal design including passenger flow optimization, security integration, and future-ready infrastructure planning.",
    source: "Airport Terminal Planning Manual",
  },
  {
    id: "ext17",
    title: "Flight Crew Training Standards",
    content:
      "International standards for flight crew training including type rating requirements, recurrent training programs, and competency-based training methodologies.",
    source: "ICAO Flight Crew Training Standards",
  },
  {
    id: "ext18",
    title: "Baggage Handling System Optimization",
    content:
      "Advanced baggage handling system design and optimization including automated sorting, tracking technologies, and mishandled baggage reduction strategies.",
    source: "Baggage Handling Technology Report",
  },
  {
    id: "ext19",
    title: "Aviation Fuel Management",
    content:
      "Comprehensive fuel management strategies including supply chain optimization, quality control procedures, and environmental impact reduction initiatives.",
    source: "Aviation Fuel Management Guide",
  },
  {
    id: "ext20",
    title: "Airport Security Technologies",
    content:
      "Latest security technologies for airports including biometric systems, advanced imaging technology, and integrated security management platforms.",
    source: "Airport Security Innovation Report",
  },
  {
    id: "ext21",
    title: "Airline Operational Control Centers",
    content:
      "Best practices for airline operational control centers including real-time monitoring, disruption management, and crew scheduling optimization.",
    source: "Operations Control Center Handbook",
  },
  {
    id: "ext22",
    title: "Aviation Insurance and Risk Management",
    content:
      "Comprehensive risk management strategies for aviation industry including insurance coverage, liability management, and operational risk mitigation.",
    source: "Aviation Risk Management Framework",
  },
  {
    id: "ext23",
    title: "Aircraft Ground Deicing Operations",
    content:
      "Standard procedures for aircraft deicing and anti-icing operations including fluid specifications, application techniques, and safety protocols.",
    source: "Aircraft Deicing Best Practices Manual",
  },
  {
    id: "ext24",
    title: "Aviation Human Factors Engineering",
    content:
      "Application of human factors engineering in aviation design including cockpit ergonomics, maintenance human factors, and air traffic control interfaces.",
    source: "Aviation Human Factors Handbook",
  },
  {
    id: "ext25",
    title: "Airport Noise Management",
    content:
      "Comprehensive noise management strategies for airports including noise monitoring, abatement procedures, and community engagement programs.",
    source: "Airport Noise Management Guidelines",
  },
  {
    id: "ext26",
    title: "Aviation Supply Chain Management",
    content:
      "Advanced supply chain management for aviation industry including parts procurement, inventory optimization, and supplier relationship management.",
    source: "Aviation Supply Chain Excellence",
  },
  {
    id: "ext27",
    title: "Flight Data Monitoring Programs",
    content:
      "Implementation of flight data monitoring programs including data analysis techniques, safety trend identification, and pilot feedback systems.",
    source: "Flight Data Monitoring Best Practices",
  },
  {
    id: "ext28",
    title: "Airport Ground Transportation",
    content:
      "Comprehensive ground transportation planning including public transit integration, parking management, and multimodal connectivity solutions.",
    source: "Airport Ground Access Planning Guide",
  },
  {
    id: "ext29",
    title: "Aviation Quality Management Systems",
    content:
      "Implementation of quality management systems in aviation including process optimization, continuous improvement, and customer satisfaction measurement.",
    source: "Aviation Quality Standards Manual",
  },
  {
    id: "ext30",
    title: "Unmanned Aircraft Systems Integration",
    content:
      "Integration of unmanned aircraft systems into controlled airspace including regulatory framework, safety protocols, and operational procedures.",
    source: "UAS Integration Guidelines",
  },
  {
    id: "ext31",
    title: "Aviation Communications Systems",
    content:
      "Advanced communication systems for aviation including satellite communications, data link systems, and voice communication optimization.",
    source: "Aviation Communications Handbook",
  },
  {
    id: "ext32",
    title: "Airport Pavement Management",
    content:
      "Comprehensive pavement management for airports including condition assessment, maintenance planning, and lifecycle cost optimization.",
    source: "Airport Pavement Design and Maintenance",
  },
  {
    id: "ext33",
    title: "Airline Customer Service Excellence",
    content:
      "Best practices for airline customer service including service recovery, complaint resolution, and customer loyalty program management.",
    source: "Airline Customer Service Standards",
  },
  {
    id: "ext34",
    title: "Aviation Environmental Management",
    content:
      "Environmental management systems for aviation including carbon footprint reduction, waste management, and sustainable development initiatives.",
    source: "Aviation Environmental Best Practices",
  },
  {
    id: "ext35",
    title: "Aircraft Certification Processes",
    content:
      "Comprehensive overview of aircraft certification processes including type certification, production certification, and continuing airworthiness requirements.",
    source: "Aircraft Certification Guidelines",
  },
  {
    id: "ext36",
    title: "Airport Master Planning",
    content:
      "Strategic airport master planning including capacity forecasting, infrastructure development, and stakeholder coordination for long-term growth.",
    source: "Airport Master Planning Handbook",
  },
  {
    id: "ext37",
    title: "Aviation Training Technology",
    content:
      "Advanced training technologies for aviation including flight simulators, virtual reality training, and computer-based training systems.",
    source: "Aviation Training Innovation Report",
  },
  {
    id: "ext38",
    title: "Airline Financial Management",
    content:
      "Financial management strategies for airlines including cost optimization, revenue enhancement, and financial risk management techniques.",
    source: "Airline Financial Planning Guide",
  },
  {
    id: "ext39",
    title: "Airport Retail and Commercial Services",
    content:
      "Optimization of airport commercial services including retail planning, food and beverage operations, and non-aeronautical revenue generation.",
    source: "Airport Commercial Development Manual",
  },
  {
    id: "ext40",
    title: "Aviation Regulatory Compliance Automation",
    content:
      "Automated systems for aviation regulatory compliance including reporting automation, audit trail management, and compliance monitoring technologies.",
    source: "Regulatory Compliance Technology Solutions",
  },
];

export const questionCategories = [
  // Airport Safety Program
  { name: "Runway Safety" },
  { name: "Ground Operations" },
  { name: "Apron Safety" },
  { name: "Training Programs" },
  { name: "Incident Management" },

  // Airport Emergency Preparedness
  { name: "Emergency Response" },
  { name: "Personnel Training" },
  { name: "ARFF Operations" },
  { name: "Communications" },
  { name: "Medical Emergency" },

  // Airport Capacity Management
  { name: "Capacity Analysis" },
  { name: "Terminal Operations" },
  { name: "Airspace Management" },
  { name: "Infrastructure Development" },

  // Safety Management System
  { name: "SMS Implementation" },
  { name: "Risk Management" },
  { name: "Safety Assurance" },
  { name: "Safety Promotion" },

  // Airport Data Flow and Analytics Program
  { name: "Analytics Capabilities" },
  { name: "Data Integration" },
  { name: "Passenger Analytics" },
  { name: "Data Security" },

  // Airline Safety Program
  { name: "Flight Operations" },
  { name: "Maintenance Safety" },
  { name: "Crew Resource Management" },
  { name: "Cabin Safety" },
  { name: "Incident Investigation" },

  // Airline Data Flow Program
  { name: "Data Management" },
  { name: "Cybersecurity" },
  { name: "Flight Data Analytics" },
  { name: "Customer Analytics" },
  { name: "Enterprise Integration" },
];

export const customAnswers = [
              {
                documentName: "Flight Operations Manual",
                page: "Page 11",
                answer:
                  "Comprehensive flight safety protocols including pre-flight checks, weather assessment procedures, and crew resource management requirements.",
              },
              {
                documentName: "Safety Risk Management",
                page: "Page 28",
                answer:
                  "Systematic approach to identifying, assessing, and mitigating operational risks throughout all phases of flight operations.",
              },
              {
                documentName: "IATA Safety Standards",
                page: "Page 35",
                answer:
                  "Implementation of international safety standards including IOSA audit requirements and best practice recommendations.",
              },
              {
                documentName: "Standard Operating Procedures",
                page: "Page 64",
                answer:
                  "Detailed standard operating procedures for normal, abnormal, and emergency situations ensuring consistent and safe flight operations.",
              },
               {
                documentName: "Enterprise Data Architecture",
                page: "Page 72",
                answer:
                  "Enterprise-wide data architecture enabling seamless integration between flight operations, maintenance, customer service, and financial systems.",
              },
              {
                documentName: "API Integration Framework",
                page: "Page 51",
                answer:
                  "Standardized API framework enabling real-time data exchange with partners, suppliers, and regulatory authorities.",
              },
              {
                documentName: "Data Governance Framework",
                page: "Page 39",
                answer:
                  "Comprehensive data governance framework ensuring data quality, consistency, and compliance across all airline operations.",
              },
                {
                documentName: "Flight Data Analytics",
                page: "Page 37",
                answer:
                  "Comprehensive flight data analysis including fuel consumption, route efficiency, and performance optimization using advanced analytics.",
              },
              {
                documentName: "Predictive Maintenance Analytics",
                page: "Page 54",
                answer:
                  "Predictive maintenance algorithms analyzing aircraft data to predict component failures and optimize maintenance schedules.",
              },
              {
                documentName: "Route Optimization Models",
                page: "Page 42",
                answer:
                  "Mathematical models for route optimization considering fuel costs, weather conditions, and air traffic constraints.",
              },
            ]


export const aiAgents = [
  {
    id: 100,
    name: "SQL Agent",
    company: "Anthropic",
    type: "Conversational AI",
    capabilities: ["text generation", "analysis", "coding", "math", "creative writing"],
    modality: ["text"],
    pricing: "freemium",
    apiAvailable: true,
    launchYear: 2022,
    description: "Constitutional AI assistant focused on being helpful, harmless, and honest"
  },
  {
    id: 101,
    name: "API Agent",
    company: "Anthropic",
    type: "Conversational AI",
    capabilities: ["text generation", "analysis", "coding", "math", "creative writing"],
    modality: ["text"],
    pricing: "freemium",
    apiAvailable: true,
    launchYear: 2022,
    description: "Constitutional AI assistant focused on being helpful, harmless, and honest"
  },
  {
    id: 102,
    name: "Web Agent",
    company: "Anthropic",
    type: "Conversational AI",
    capabilities: ["text generation", "analysis", "coding", "math", "creative writing"],
    modality: ["text"],
    pricing: "freemium",
    apiAvailable: true,
    launchYear: 2022,
    description: "Constitutional AI assistant focused on being helpful, harmless, and honest"
  }
];


// Extracted document names from the mockCategories data
export const AirportDocuments = [
  {
    id: "doc1",
    documentName: "Airport Safety Manual"
  },
  {
    id: "doc2", 
    documentName: "ICAO Airport Standards"
  },
  {
    id: "doc3",
    documentName: "FAA Advisory Circular"
  },
  {
    id: "doc4",
    documentName: "Runway Safety Best Practices"
  },
  {
    id: "doc5",
    documentName: "Wildlife Management Guidelines"
  },
  {
    id: "doc6",
    documentName: "Ground Operations Manual"
  },
  {
    id: "doc7",
    documentName: "Safety Risk Assessment"
  },
  {
    id: "doc8",
    documentName: "Equipment Safety Standards"
  },
  {
    id: "doc9",
    documentName: "Personnel Training Requirements"
  },
  {
    id: "doc10",
    documentName: "Apron Safety Guidelines"
  },
  {
    id: "doc11",
    documentName: "Ground Traffic Management"
  },
  {
    id: "doc12",
    documentName: "Foreign Object Debris Prevention"
  },
  {
    id: "doc13",
    documentName: "Training Curriculum Standards"
  },
  {
    id: "doc14",
    documentName: "Competency Assessment Framework"
  },
  {
    id: "doc15",
    documentName: "Safety Culture Development"
  },
  {
    id: "doc16",
    documentName: "Incident Investigation Procedures"
  },
  {
    id: "doc17",
    documentName: "Safety Reporting Systems"
  },
  {
    id: "doc18",
    documentName: "Regulatory Notification Requirements"
  },
  {
    id: "doc19",
    documentName: "Emergency Response Plan"
  },
  {
    id: "doc20",
    documentName: "Crisis Management Manual"
  },
  {
    id: "doc21",
    documentName: "ICAO Emergency Planning"
  },
  {
    id: "doc22",
    documentName: "Incident Command System"
  },
  {
    id: "doc23",
    documentName: "Training Requirements Manual"
  },
  {
    id: "doc24",
    documentName: "Certification Standards"
  },
  {
    id: "doc25",
    documentName: "International Training Standards"
  },
  {
    id: "doc26",
    documentName: "Specialized Equipment Training"
  },
  {
    id: "doc27",
    documentName: "ARFF Operations Manual"
  },
  {
    id: "doc28",
    documentName: "Equipment Specifications"
  },
  {
    id: "doc29",
    documentName: "Response Time Standards"
  },
  {
    id: "doc30",
    documentName: "Emergency Communications Protocol"
  },
  {
    id: "doc31",
    documentName: "Communication Equipment Standards"
  },
  {
    id: "doc32",
    documentName: "Multi-Agency Coordination"
  },
  {
    id: "doc33",
    documentName: "Medical Emergency Procedures"
  },
  {
    id: "doc34",
    documentName: "Medical Equipment Standards"
  },
  {
    id: "doc35",
    documentName: "Medical Personnel Requirements"
  },
  {
    id: "doc36",
    documentName: "Capacity Analysis Report"
  },
  {
    id: "doc37",
    documentName: "Traffic Flow Management"
  },
  {
    id: "doc38",
    documentName: "IATA Capacity Guidelines"
  },
  {
    id: "doc39",
    documentName: "Runway Capacity Modeling"
  },
  {
    id: "doc40",
    documentName: "Terminal Operations Analysis"
  },
  {
    id: "doc41",
    documentName: "Passenger Flow Optimization"
  },
  {
    id: "doc42",
    documentName: "Baggage Handling Capacity"
  },
  {
    id: "doc43",
    documentName: "Airspace Management Procedures"
  },
  {
    id: "doc44",
    documentName: "Air Traffic Flow Management"
  },
  {
    id: "doc45",
    documentName: "Approach and Departure Optimization"
  },
  {
    id: "doc46",
    documentName: "Infrastructure Development Plan"
  },
  {
    id: "doc47",
    documentName: "Operational Efficiency Improvements"
  },
  {
    id: "doc48",
    documentName: "Technology Integration"
  },
  {
    id: "doc49",
    documentName: "SMS Implementation Guide"
  },
  {
    id: "doc50",
    documentName: "Regulatory Compliance Manual"
  },
  {
    id: "doc51",
    documentName: "Safety Performance Indicators"
  },
  {
    id: "doc52",
    documentName: "SMS Documentation Requirements"
  },
  {
    id: "doc53",
    documentName: "Safety Risk Management Procedures"
  },
  {
    id: "doc54",
    documentName: "Hazard Identification Methods"
  },
  {
    id: "doc55",
    documentName: "Risk Assessment Matrix"
  },
  {
    id: "doc56",
    documentName: "Safety Assurance Framework"
  },
  {
    id: "doc57",
    documentName: "Safety Audit Procedures"
  },
  {
    id: "doc58",
    documentName: "Safety Performance Monitoring"
  },
  {
    id: "doc59",
    documentName: "Safety Promotion Strategy"
  },
  {
    id: "doc60",
    documentName: "Safety Training Programs"
  },
  {
    id: "doc61",
    documentName: "Safety Culture Assessment"
  },
  {
    id: "doc62",
    documentName: "Data Analytics Framework"
  },
  {
    id: "doc63",
    documentName: "Performance Monitoring System"
  },
  {
    id: "doc64",
    documentName: "Business Intelligence Platform"
  },
  {
    id: "doc65",
    documentName: "Predictive Analytics Tools"
  },
  {
    id: "doc66",
    documentName: "Data Integration Architecture"
  },
  {
    id: "doc67",
    documentName: "API Management System"
  },
  {
    id: "doc68",
    documentName: "Data Quality Management"
  },
  {
    id: "doc69",
    documentName: "Passenger Analytics Suite"
  },
  {
    id: "doc70",
    documentName: "Queue Management Analytics"
  },
  {
    id: "doc71",
    documentName: "Revenue Analytics Platform"
  },
  {
    id: "doc72",
    documentName: "Data Security Framework"
  },
  {
    id: "doc73",
    documentName: "Privacy Protection Measures"
  },
  {
    id: "doc74",
    documentName: "Cybersecurity Protocols"
  },
  {
    id: "doc75",
    documentName: "Flight Operations Manual"
  },
  {
    id: "doc76",
    documentName: "IATA Safety Standards"
  },
  {
    id: "doc77",
    documentName: "Standard Operating Procedures"
  },
  {
    id: "doc78",
    documentName: "Maintenance Program Manual"
  },
  {
    id: "doc79",
    documentName: "Quality Assurance Program"
  },
  {
    id: "doc80",
    documentName: "Regulatory Compliance Guide"
  },
  {
    id: "doc81",
    documentName: "Maintenance Safety Culture"
  },
  {
    id: "doc82",
    documentName: "CRM Training Manual"
  },
  {
    id: "doc83",
    documentName: "Human Factors Guidelines"
  },
  {
    id: "doc84",
    documentName: "Threat and Error Management"
  },
  {
    id: "doc85",
    documentName: "Cabin Safety Manual"
  },
  {
    id: "doc86",
    documentName: "Emergency Equipment Standards"
  },
  {
    id: "doc87",
    documentName: "Cabin Crew Training Requirements"
  },
  {
    id: "doc88",
    documentName: "Flight Data Analysis"
  },
  {
    id: "doc89",
    documentName: "Safety Reporting Culture"
  },
  {
    id: "doc90",
    documentName: "Data Management Strategy"
  },
  {
    id: "doc91",
    documentName: "Analytics Platform Guide"
  },
  {
    id: "doc92",
    documentName: "Performance Metrics Framework"
  },
  {
    id: "doc93",
    documentName: "Real-time Data Processing"
  },
  {
    id: "doc94",
    documentName: "Cybersecurity Framework"
  },
  {
    id: "doc95",
    documentName: "Data Protection Policy"
  },
  {
    id: "doc96",
    documentName: "Incident Response Plan"
  },
  {
    id: "doc97",
    documentName: "Security Monitoring Systems"
  },
  {
    id: "doc98",
    documentName: "Flight Data Analytics"
  },
  {
    id: "doc99",
    documentName: "Predictive Maintenance Analytics"
  },
  {
    id: "doc100",
    documentName: "Route Optimization Models"
  },
  {
    id: "doc101",
    documentName: "Customer Analytics Platform"
  },
  {
    id: "doc102",
    documentName: "Revenue Management Analytics"
  },
  {
    id: "doc103",
    documentName: "Passenger Experience Analytics"
  },
  {
    id: "doc104",
    documentName: "Enterprise Data Architecture"
  },
  {
    id: "doc105",
    documentName: "API Integration Framework"
  },
  {
    id: "doc106",
    documentName: "Data Governance Framework"
  }
];

export const assignUser = [
  { id: 1, fullName: "James Anderson" },
  { id: 2, fullName: "Olivia Brown" },
  { id: 3, fullName: "Liam Johnson" },
  { id: 4, fullName: "Emma Miller" },
  { id: 5, fullName: "Noah Davis" },
  { id: 6, fullName: "Ava Garcia" },
  { id: 7, fullName: "William Martinez" },
  { id: 8, fullName: "Sophia Harris" },
  { id: 9, fullName: "Benjamin Clark" },
  { id: 10, fullName: "Charlotte Lewis" },
  { id: 11, fullName: "Elijah Walker" },
  { id: 12, fullName: "Amelia Hall" },
  { id: 13, fullName: "Lucas Allen" },
  { id: 14, fullName: "Mia Young" },
  { id: 15, fullName: "Henry Scott" },
  { id: 16, fullName: "Isabella King" },
  { id: 17, fullName: "Jack Wright" },
  { id: 18, fullName: "Harper Green" },
  { id: 19, fullName: "Alexander Baker" },
  { id: 20, fullName: "Evelyn Adams" }
];


export const agentsMockData = [
  {
    page: 1,
    documentName: "SQL Agent",
    answer: "Queried the database to extract passenger traffic data from the last month, categorized by terminal, day, and airline to support capacity planning and staff allocation decisions."
  },
  {
    page: 3,
    documentName: "API Agent",
    answer: "Analyzed historical data to predict congestion times at security checkpoints and suggested optimal staff scheduling and queue management strategies to improve passenger flow and reduce delays."
  },
  {
    page: 2,
    documentName: "Internet Agent",
    answer: "Fetched real-time weather conditions and delays for all international flights using public aviation APIs to help travelers plan accordingly and avoid unnecessary waiting at the airport."
  }
];


export const selectedAnswerOption = [
  {
    id: 1,
    icon: TypeOutline,
    text: "Text"
  },
  {
    id: 2,
    icon: Table,
    text: "Table"
  },
  {
    id: 3,
    icon: ChartColumnStacked,
    text: "Chart"
  }
]

export const docGenTable = [
  {
    id: 1,
    name: "ASP (Airport Security)",
    type: "Word"
  },
  {
    id: 2,
    name: "Passenger Flow Report",
    type: "PDF"
  },
  {
    id: 3,
    name: "Flight Schedule Data",
    type: "CSV"
  }
];

export const tabelContentFirst = [
    {
      event: { id: "event-1", content: "Incident or near-miss" },
      investigation: { id: "investigation-1", content: "Best practice" },
      whoToNotify: [{ id: "notify-1-1", content: "JHSC" }],
      timeframe: [{ id: "time-1-1", content: "Within 4 days" }],
      documentation: [{ id: "doc-1-1", content: "Internal incident/accident report" }],
    },
    {
      event: { id: "event-2", content: "First-aid only injury" },
      investigation: { id: "investigation-2", content: "Best practice" },
      whoToNotify: [{ id: "notify-2-1", content: "JHSC" }],
      timeframe: [{ id: "time-2-1", content: "Within 4 days" }],
      documentation: [{ id: "doc-2-1", content: "Internal incident/accident report" }],
    },
    {
      event: { id: "event-3", content: "Non-critical injury requiring medical treatment" },
      investigation: { id: "investigation-3", content: "Best practice" },
      whoToNotify: [
        { id: "notify-3-1", content: "JHSC" },
        { id: "notify-3-2", content: "WSIB" },
      ],
      timeframe: [
        { id: "time-3-1", content: "Within 4 days" },
        { id: "time-3-2", content: "Within 3 days" },
      ],
      documentation: [
        { id: "doc-3-1", content: "Internal incident/accident report" },
        { id: "doc-3-2", content: "WSIB Form 7" },
      ],
    },
    {
      event: { id: "event-4", content: "Critical injury or fatality" },
      investigation: { id: "investigation-4", content: "Required" },
      whoToNotify: [
        { id: "notify-4-1", content: "MLTSD" },
        { id: "notify-4-2", content: "JHSC" },
        { id: "notify-4-3", content: "WSIB" },
      ],
      timeframe: [
        { id: "time-4-1", content: "48 hours" },
        { id: "time-4-2", content: "As soon as possible" },
        { id: "time-4-3", content: "Within 3 days" },
      ],
      documentation: [
        { id: "doc-4-1", content: "Accident Report submitted by the employer to MLTSD" },
        { id: "doc-4-2", content: "Accident Investigation support submitted to employer and MLTSD by JHSC" },
        { id: "doc-4-3", content: "WSIB Form 7" },
      ],
    },
  ]


export const tabelContentSecond = [
    {
      event: { id: "event-1", content: "Project delay (< 1 week)" },
      investigation: { id: "investigation-1", content: "Team review" },
      whoToNotify: [{ id: "notify-1-1", content: "Project Manager" }],
      timeframe: [{ id: "time-1-1", content: "Within 24 hours" }],
      documentation: [{ id: "doc-1-1", content: "Status update email" }],
    },
    {
      event: { id: "event-2", content: "Budget variance (10-20%)" },
      investigation: { id: "investigation-2", content: "Financial analysis" },
      whoToNotify: [
        { id: "notify-2-1", content: "Finance Team" },
        { id: "notify-2-2", content: "Department Head" },
      ],
      timeframe: [
        { id: "time-2-1", content: "Within 2 days" },
        { id: "time-2-2", content: "Within 3 days" },
      ],
      documentation: [
        { id: "doc-2-1", content: "Budget variance report" },
        { id: "doc-2-2", content: "Corrective action plan" },
      ],
    },
    {
      event: { id: "event-3", content: "Quality issue identified" },
      investigation: { id: "investigation-3", content: "Root cause analysis" },
      whoToNotify: [
        { id: "notify-3-1", content: "Quality Assurance" },
        { id: "notify-3-2", content: "Client" },
        { id: "notify-3-3", content: "Senior Management" },
      ],
      timeframe: [
        { id: "time-3-1", content: "Immediately" },
        { id: "time-3-2", content: "Within 4 hours" },
        { id: "time-3-3", content: "Within 1 day" },
      ],
      documentation: [
        { id: "doc-3-1", content: "Quality incident report" },
        { id: "doc-3-2", content: "Client notification letter" },
        { id: "doc-3-3", content: "Remediation plan" },
      ],
    },
    {
      event: { id: "event-4", content: "Critical system failure" },
      investigation: { id: "investigation-4", content: "Emergency response" },
      whoToNotify: [
        { id: "notify-4-1", content: "IT Support" },
        { id: "notify-4-2", content: "All Stakeholders" },
        { id: "notify-4-3", content: "Executive Team" },
        { id: "notify-4-4", content: "External Vendors" },
      ],
      timeframe: [
        { id: "time-4-1", content: "Immediately" },
        { id: "time-4-2", content: "Within 30 minutes" },
        { id: "time-4-3", content: "Within 1 hour" },
        { id: "time-4-4", content: "Within 2 hours" },
      ],
      documentation: [
        { id: "doc-4-1", content: "System failure incident report" },
        { id: "doc-4-2", content: "Stakeholder communication log" },
        { id: "doc-4-3", content: "Recovery timeline document" },
        { id: "doc-4-4", content: "Post-incident review report" },
      ],
    },
    {
      event: { id: "event-5", content: "Resource unavailability" },
      investigation: { id: "investigation-5", content: "Resource assessment" },
      whoToNotify: [
        { id: "notify-5-1", content: "Resource Manager" },
        { id: "notify-5-2", content: "Project Sponsor" },
      ],
      timeframe: [
        { id: "time-5-1", content: "Within 1 day" },
        { id: "time-5-2", content: "Within 2 days" },
      ],
      documentation: [
        { id: "doc-5-1", content: "Resource impact assessment" },
        { id: "doc-5-2", content: "Alternative resource plan" },
      ],
    },
  ]


export const chartImage = "http://res.cloudinary.com/dakddv1pm/image/upload/v1750859132/posts/ejf3gcglf47l8bksm2it.webp"
export const chartImageSecond ="http://res.cloudinary.com/dakddv1pm/image/upload/v1750859295/posts/qtsegloqspheh7hljmap.jpg"