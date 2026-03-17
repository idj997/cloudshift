# CloudShift

> Visual cross-cloud architecture translator — design on AWS, Azure, or GCP, then instantly see the equivalent architecture on any other cloud. Generates Terraform for everything.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Deployed-GitHub%20Pages-blue.svg)](https://idj997.github.io/cloudshift)
[![Made with HTML](https://img.shields.io/badge/Built%20with-HTML%2FJS-orange.svg)]()

---

## What it does

CloudShift is a browser-based visual tool for individual developers who work across multiple clouds. Drop services onto a canvas, connect them, and translate the entire architecture to an equivalent setup on another cloud — with confidence ratings showing where mappings are exact vs. approximate.

**Core features:**

- **Visual canvas** — drag and drop 50+ services from AWS, Azure, and GCP onto a shared canvas
- **Cross-cloud translation** — all 6 directions covered: AWS ↔ Azure, AWS ↔ GCP, Azure ↔ GCP
- **Confidence ratings** — every mapping is labelled `exact`, `equiv`, or `partial` so you know where to expect refactoring work
- **Terraform generation** — exports `main.tf`, `variables.tf`, and `outputs.tf` with real HCL for your architecture
- **Zero backend** — single HTML file, no build step, no server, no login

---

## Demo

Live site → **[https://idj997.github.io/cloudshift](https://idj997.github.io/cloudshift)**

---

## Getting started

No install needed. Open `index.html` directly in any modern browser:

```bash
git clone https://github.com/idj997/cloudshift.git
cd cloudshift
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

---

## Self-hosting

CloudShift is a static HTML file — it deploys anywhere that serves HTML.

### GitHub Pages (this repo)

```bash
# Any push to main auto-deploys via GitHub Actions
git add index.html
git commit -m "update"
git push
```

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

Drag the project folder into [app.netlify.com/drop](https://app.netlify.com/drop).

### AWS S3 + CloudFront

```bash
aws s3 cp index.html s3://your-bucket/
aws cloudfront create-invalidation --distribution-id DIST_ID --paths "/*"
```

---

## Project structure

```
cloudshift/
├── index.html          # Entire app — single self-contained file
├── LICENSE             # MIT
└── README.md
```

---

## Supported services

| Category    | AWS                                         | Azure                              | GCP                              |
|-------------|---------------------------------------------|------------------------------------|----------------------------------|
| Compute     | EC2, Lambda, ECS, EKS, Beanstalk            | VMs, Functions, ACI, AKS, App Svc  | GCE, Cloud Functions, Cloud Run, GKE, App Engine |
| Storage     | S3, EBS, EFS, Glacier                       | Blob, Managed Disks, Azure Files   | Cloud Storage, Persistent Disk, Filestore |
| Database    | RDS, DynamoDB, Aurora, ElastiCache, Redshift| SQL DB, Cosmos DB, Redis, Synapse  | Cloud SQL, Firestore, Bigtable, BigQuery, Memorystore |
| Networking  | VPC, ALB, CloudFront, Route 53, API Gateway | VNet, Load Balancer, CDN, DNS, APIM| VPC, Cloud LB, Cloud CDN, Cloud DNS, Cloud Endpoints |
| Security    | IAM, Cognito, KMS, WAF                      | Azure AD, AD B2C, Key Vault        | Cloud IAM, Cloud KMS             |
| Messaging   | SQS, SNS, Kinesis, EventBridge              | Service Bus, Event Hubs            | Pub/Sub, Dataflow                |

---

## Contributing

Contributions are welcome. The most useful things to add:

- More service mappings (especially for niche services)
- Improved confidence ratings with notes
- Additional Terraform resource templates
- Import from existing Terraform / CloudFormation

```bash
git clone https://github.com/idj997/cloudshift.git
cd cloudshift
# Open index.html — all code is in that single file
# Edit, test in browser, submit a PR
```

Please open an issue before starting large changes.

---

## License

[MIT](./LICENSE) — free to use, modify, and distribute.
