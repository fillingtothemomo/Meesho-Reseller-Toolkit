# System Design Diagrams

## 1. High-level Flowchart

<div style="zoom:70%">

```mermaid
flowchart TD
  U[Reseller Page]
  F[Template Selection]
  S[Go Build API]
  V[Validate payload]
  D{Template exists?}
  C[Create deployment ID]
  CS[Copy static shell]
  CA[Copy template assets]
  PG[Process gallery images]
  RW[Rewrite data json]
  WD[Write data json]
  R[Return deployment info]
  SV[Serve deployments]
  OPT[Upload to S3 and CDN]
  ERR[Return error]

  U --> F
  F --> S
  S --> V
  V --> D
  D -- yes --> C
  D -- no --> ERR
  C --> CS
  C --> CA
  C --> PG
  PG --> RW
  RW --> WD
  WD --> R
  WD --> SV
  SV --> OPT
```

<br>
<br>
The image flow (not really useful this but okay)

<div style="zoom:90%">

```mermaid
flowchart TB
  Start[gallery item url]
  Start --> IsRemote{Is url remote}
  IsRemote -- yes --> Download[Download image with timeout]
  Download --> CheckStatus{Status ok}
  CheckStatus -- no --> Error[Record error and fallback]
  CheckStatus -- yes --> CheckType{Content type is image}
  CheckType -- no --> Error
  CheckType -- yes --> Limit[Limit bytes while saving]
  Limit --> Name[Generate safe filename]
  Name --> Save[Write file to outDir images]
  Save --> SetUrl[Set item url to local path]
  IsRemote -- no --> Normalize[Normalize local path]
  Normalize --> Exists{Exists in template images}
  Exists -- yes --> Copy[Copy file to outDir images]
  Copy --> SetUrl
  Exists -- no --> Error
```
<br>
<br>

The seq flow

<div style="zoom:90%">

```mermaid
sequenceDiagram
  participant User
  participant Frontend
  participant API
  participant Templates
  participant Shell
  participant FS
  participant Visitor
  participant CDN

  User->>Frontend: select template and submit form
  Frontend->>API: POST build request
  API->>API: validate payload
  API->>Templates: read template manifest
  alt template exists
    API->>API: create deployment id and outDir
    API->>Shell: copy shell to outDir
    API->>Templates: copy assets and images
    API->>API: process images (download or copy)
    API->>FS: save images to outDir images
    API->>API: rewrite image urls to local paths
    API->>FS: write data json to outDir
    API->>API: optional upload to storage
    API-->>Frontend: return deployment id and index url
  else template missing
    API-->>Frontend: return error
  end
  User->>Visitor: open index url
  Visitor->>FS: fetch index html
  Visitor->>Visitor: load shell and fetch data json
  Visitor->>Visitor: render page using local images
```