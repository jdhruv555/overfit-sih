\# MVP Plan: Defence Cyber Incident \& Safety Portal



> \*\*Purpose:\*\* Outline the Minimum Viable Product (MVP) scope for a 3-day SIH prototype.



---



\## 1. Objective



Develop a functional prototype that demonstrates secure intake, AI-assisted triage, user alerts, and CERT‑Army integration in a simplified but working flow.



---

\# MVP Plan: Defence Cyber Incident \& Safety Portal



> \*\*Purpose:\*\* Outline the Minimum Viable Product (MVP) scope for a 3-day SIH prototype.



---



\## 1. Objective



Develop a functional prototype that demonstrates secure intake, AI-assisted triage, user alerts, and CERT‑Army integration in a simplified but working flow.



---



\## 2. MVP Features



\### 2.1 Intake \& Storage



\* Web portal with secure login (username/password + OTP).

\* Complaint submission form supporting:



&nbsp; \* Text description

&nbsp; \* URL field

&nbsp; \* Single file/image upload (max 10 MB)

\* Evidence stored with SHA-256 hash + encrypted at rest (Postgres + local file store).



\### 2.2 AI/ML Classification



\* Basic ML classifier:



&nbsp; \* Text/URL phishing detection using regex + lightweight ML (logistic regression or pretrained phishing dataset model).

&nbsp; \* File type detection (image vs document).

\* Output: \*\*Risk label\*\* (Safe, Suspicious, Malicious) + confidence score.



\### 2.3 Alerts \& Playbooks



\* Immediate alert to user:



&nbsp; \* \*\*Green (Safe)\*\*: No action needed.

&nbsp; \* \*\*Yellow (Suspicious)\*\*: Exercise caution, suggested steps.

&nbsp; \* \*\*Red (Malicious)\*\*: Urgent steps (disconnect device, reset credentials).

\* 3 templated playbooks embedded in portal.



\### 2.4 CERT‑Army Dashboard (Operator View)



\* Web dashboard listing all incidents with:



&nbsp; \* Reporter ID

&nbsp; \* Evidence type

&nbsp; \* AI classification result

&nbsp; \* Priority score

\* Basic filters: by risk level, by submission time.



\### 2.5 CERT Linkage



\* Simulated secure API endpoint (HTTPS webhook).

\* JSON payload containing incident metadata + classification result pushed automatically for \*\*Red\*\* cases.



---



\## 3. Tech Stack



\* \*\*Frontend:\*\* React + Tailwind

\* \*\*Backend:\*\* FastAPI (Python)

\* \*\*Database:\*\* PostgreSQL

\* \*\*AI/ML:\*\* Scikit-learn (simple classifier), regex heuristics

\* \*\*Storage:\*\* Local encrypted file storage (for demo)

\* \*\*Deployment:\*\* Docker Compose (local demo cluster)



---



\## 4. Architecture (Simplified)



```

\[User Portal] → \[API Gateway] → \[Intake Service] → \[ML Classifier] → \[Database + Storage]

&nbsp;                                                           ↓

&nbsp;                                            \[Alert + Playbook Engine]

&nbsp;                                                           ↓

&nbsp;                                       \[CERT Dashboard + Webhook]

```



---



\## 5. Deliverables (3-Day Timeline)



\### Day 1



\* Setup repo + Dockerized backend \& Postgres.

\* Build intake form (text, URL, file upload).

\* Implement SHA-256 hashing + evidence storage.



\### Day 2



\* Implement simple ML phishing classifier.

\* Build alert engine with traffic-light system.

\* Design CERT dashboard with filter/sort.



\### Day 3



\* Integrate webhook for CERT linkage.

\* Polish UI (basic styling).

\* End-to-end testing with sample incidents.



---



\## 6. Demo Scenario



1\. User logs into portal.

2\. Submits suspicious URL + file.

3\. System classifies as \*\*Malicious\*\*.

4\. User receives \*\*Red Alert\*\* + recommended steps.

5\. CERT dashboard updates with new high-priority incident.

6\. Simulated CERT API endpoint receives signed JSON payload.



---



\## 7. Out of Scope (Future Work)



\* Mobile app support.

\* Advanced multi-modal AI models (images, audio, video).

\* Integration with real CERT systems.

\* Immutable blockchain logs.



---



\*End of document.\*



\## 2. MVP Features



\### 2.1 Intake \& Storage



\* Web portal with secure login (username/password + OTP).

\* Complaint submission form supporting:



&nbsp; \* Text description

&nbsp; \* URL field

&nbsp; \* Single file/image upload (max 10 MB)

\* Evidence stored with SHA-256 hash + encrypted at rest (Postgres + local file store).



\### 2.2 AI/ML Classification



\* Basic ML classifier:



&nbsp; \* Text/URL phishing detection using regex + lightweight ML (logistic regression or pretrained phishing dataset model).

&nbsp; \* File type detection (image vs document).

\* Output: \*\*Risk label\*\* (Safe, Suspicious, Malicious) + confidence score.



\### 2.3 Alerts \& Playbooks



\* Immediate alert to user:



&nbsp; \* \*\*Green (Safe)\*\*: No action needed.

&nbsp; \* \*\*Yellow (Suspicious)\*\*: Exercise caution, suggested steps.

&nbsp; \* \*\*Red (Malicious)\*\*: Urgent steps (disconnect device, reset credentials).

\* 3 templated playbooks embedded in portal.



\### 2.4 CERT‑Army Dashboard (Operator View)



\* Web dashboard listing all incidents with:



&nbsp; \* Reporter ID

&nbsp; \* Evidence type

&nbsp; \* AI classification result

&nbsp; \* Priority score

\* Basic filters: by risk level, by submission time.



\### 2.5 CERT Linkage



\* Simulated secure API endpoint (HTTPS webhook).

\* JSON payload containing incident metadata + classification result pushed automatically for \*\*Red\*\* cases.



---



\## 3. Tech Stack



\* \*\*Frontend:\*\* React + Tailwind

\* \*\*Backend:\*\* FastAPI (Python)

\* \*\*Database:\*\* PostgreSQL

\* \*\*AI/ML:\*\* Scikit-learn (simple classifier), regex heuristics

\* \*\*Storage:\*\* Local encrypted file storage (for demo)

\* \*\*Deployment:\*\* Docker Compose (local demo cluster)



---



\## 4. Architecture (Simplified)



```

\[User Portal] → \[API Gateway] → \[Intake Service] → \[ML Classifier] → \[Database + Storage]

&nbsp;                                                           ↓

&nbsp;                                            \[Alert + Playbook Engine]

&nbsp;                                                           ↓

&nbsp;                                       \[CERT Dashboard + Webhook]

```



---



\## 5. Deliverables (3-Day Timeline)



\### Day 1



\* Setup repo + Dockerized backend \& Postgres.

\* Build intake form (text, URL, file upload).

\* Implement SHA-256 hashing + evidence storage.



\### Day 2



\* Implement simple ML phishing classifier.

\* Build alert engine with traffic-light system.

\* Design CERT dashboard with filter/sort.



\### Day 3



\* Integrate webhook for CERT linkage.

\* Polish UI (basic styling).

\* End-to-end testing with sample incidents.



---



\## 6. Demo Scenario



1\. User logs into portal.

2\. Submits suspicious URL + file.

3\. System classifies as \*\*Malicious\*\*.

4\. User receives \*\*Red Alert\*\* + recommended steps.

5\. CERT dashboard updates with new high-priority incident.

6\. Simulated CERT API endpoint receives signed JSON payload.



---



\## 7. Out of Scope (Future Work)



\* Mobile app support.

\* Advanced multi-modal AI models (images, audio, video).

\* Integration with real CERT systems.

\* Immutable blockchain logs.



---



\*End of document.\*



