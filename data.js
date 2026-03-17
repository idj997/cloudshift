// Cloud service data with icons, categories, and cross-cloud mappings
const CLOUD_SERVICES = {
  aws: {
    compute: [
      { id: 'ec2', name: 'EC2', desc: 'Virtual machines', icon: '🖥️', color: '#FF9900', tf: 'aws_instance' },
      { id: 'lambda', name: 'Lambda', desc: 'Serverless functions', icon: '⚡', color: '#FF9900', tf: 'aws_lambda_function' },
      { id: 'ecs', name: 'ECS', desc: 'Container service', icon: '📦', color: '#FF9900', tf: 'aws_ecs_service' },
      { id: 'eks', name: 'EKS', desc: 'Kubernetes service', icon: '☸️', color: '#FF9900', tf: 'aws_eks_cluster' },
      { id: 'beanstalk', name: 'Elastic Beanstalk', desc: 'PaaS platform', icon: '🌱', color: '#FF9900', tf: 'aws_elastic_beanstalk_application' },
    ],
    storage: [
      { id: 's3', name: 'S3', desc: 'Object storage', icon: '🗄️', color: '#569A31', tf: 'aws_s3_bucket' },
      { id: 'ebs', name: 'EBS', desc: 'Block storage', icon: '💾', color: '#569A31', tf: 'aws_ebs_volume' },
      { id: 'efs', name: 'EFS', desc: 'File system', icon: '📁', color: '#569A31', tf: 'aws_efs_file_system' },
      { id: 'glacier', name: 'Glacier', desc: 'Archive storage', icon: '🧊', color: '#569A31', tf: 'aws_glacier_vault' },
    ],
    database: [
      { id: 'rds', name: 'RDS', desc: 'Managed SQL database', icon: '🗃️', color: '#3B48CC', tf: 'aws_db_instance' },
      { id: 'dynamodb', name: 'DynamoDB', desc: 'NoSQL database', icon: '⚡🗃️', color: '#3B48CC', tf: 'aws_dynamodb_table' },
      { id: 'aurora', name: 'Aurora', desc: 'High-perf database', icon: '🌟', color: '#3B48CC', tf: 'aws_rds_cluster' },
      { id: 'elasticache', name: 'ElastiCache', desc: 'In-memory cache', icon: '⚡💾', color: '#3B48CC', tf: 'aws_elasticache_cluster' },
      { id: 'redshift', name: 'Redshift', desc: 'Data warehouse', icon: '📊', color: '#3B48CC', tf: 'aws_redshift_cluster' },
    ],
    networking: [
      { id: 'vpc', name: 'VPC', desc: 'Virtual private cloud', icon: '🌐', color: '#8C4FFF', tf: 'aws_vpc' },
      { id: 'alb', name: 'ALB', desc: 'App load balancer', icon: '⚖️', color: '#8C4FFF', tf: 'aws_lb' },
      { id: 'cloudfront', name: 'CloudFront', desc: 'CDN service', icon: '🌍', color: '#8C4FFF', tf: 'aws_cloudfront_distribution' },
      { id: 'route53', name: 'Route 53', desc: 'DNS service', icon: '🔀', color: '#8C4FFF', tf: 'aws_route53_zone' },
      { id: 'apigateway', name: 'API Gateway', desc: 'API management', icon: '🔌', color: '#8C4FFF', tf: 'aws_api_gateway_rest_api' },
    ],
    security: [
      { id: 'iam', name: 'IAM', desc: 'Identity & access', icon: '🔐', color: '#DD344C', tf: 'aws_iam_role' },
      { id: 'cognito', name: 'Cognito', desc: 'User authentication', icon: '👤', color: '#DD344C', tf: 'aws_cognito_user_pool' },
      { id: 'kms', name: 'KMS', desc: 'Key management', icon: '🗝️', color: '#DD344C', tf: 'aws_kms_key' },
      { id: 'waf', name: 'WAF', desc: 'Web app firewall', icon: '🛡️', color: '#DD344C', tf: 'aws_wafv2_web_acl' },
    ],
    messaging: [
      { id: 'sqs', name: 'SQS', desc: 'Message queue', icon: '📬', color: '#FF4F8B', tf: 'aws_sqs_queue' },
      { id: 'sns', name: 'SNS', desc: 'Pub/sub messaging', icon: '📢', color: '#FF4F8B', tf: 'aws_sns_topic' },
      { id: 'eventbridge', name: 'EventBridge', desc: 'Event bus', icon: '🎯', color: '#FF4F8B', tf: 'aws_cloudwatch_event_bus' },
      { id: 'kinesis', name: 'Kinesis', desc: 'Data streaming', icon: '🌊', color: '#FF4F8B', tf: 'aws_kinesis_stream' },
    ],
    monitoring: [
      { id: 'cloudwatch', name: 'CloudWatch', desc: 'Monitoring & logs', icon: '📈', color: '#E7157B', tf: 'aws_cloudwatch_metric_alarm' },
      { id: 'xray', name: 'X-Ray', desc: 'Distributed tracing', icon: '🔍', color: '#E7157B', tf: 'aws_xray_group' },
    ]
  },
  azure: {
    compute: [
      { id: 'az_vm', name: 'Virtual Machines', desc: 'Compute instances', icon: '🖥️', color: '#0078D4', tf: 'azurerm_virtual_machine' },
      { id: 'az_functions', name: 'Azure Functions', desc: 'Serverless compute', icon: '⚡', color: '#0078D4', tf: 'azurerm_function_app' },
      { id: 'az_aci', name: 'Container Instances', desc: 'Container service', icon: '📦', color: '#0078D4', tf: 'azurerm_container_group' },
      { id: 'az_aks', name: 'AKS', desc: 'Kubernetes service', icon: '☸️', color: '#0078D4', tf: 'azurerm_kubernetes_cluster' },
      { id: 'az_appservice', name: 'App Service', desc: 'PaaS platform', icon: '🌱', color: '#0078D4', tf: 'azurerm_app_service' },
    ],
    storage: [
      { id: 'az_blob', name: 'Blob Storage', desc: 'Object storage', icon: '🗄️', color: '#00BCF2', tf: 'azurerm_storage_blob' },
      { id: 'az_disk', name: 'Managed Disks', desc: 'Block storage', icon: '💾', color: '#00BCF2', tf: 'azurerm_managed_disk' },
      { id: 'az_files', name: 'Azure Files', desc: 'File shares', icon: '📁', color: '#00BCF2', tf: 'azurerm_storage_share' },
    ],
    database: [
      { id: 'az_sqldb', name: 'SQL Database', desc: 'Managed SQL', icon: '🗃️', color: '#3B48CC', tf: 'azurerm_sql_database' },
      { id: 'az_cosmos', name: 'Cosmos DB', desc: 'NoSQL database', icon: '🌌', color: '#3B48CC', tf: 'azurerm_cosmosdb_account' },
      { id: 'az_redis', name: 'Azure Cache', desc: 'Redis cache', icon: '⚡💾', color: '#3B48CC', tf: 'azurerm_redis_cache' },
      { id: 'az_synapse', name: 'Synapse', desc: 'Analytics', icon: '📊', color: '#3B48CC', tf: 'azurerm_synapse_workspace' },
    ],
    networking: [
      { id: 'az_vnet', name: 'Virtual Network', desc: 'Private network', icon: '🌐', color: '#8C4FFF', tf: 'azurerm_virtual_network' },
      { id: 'az_lb', name: 'Load Balancer', desc: 'Traffic balancer', icon: '⚖️', color: '#8C4FFF', tf: 'azurerm_lb' },
      { id: 'az_cdn', name: 'Azure CDN', desc: 'Content delivery', icon: '🌍', color: '#8C4FFF', tf: 'azurerm_cdn_profile' },
      { id: 'az_dns', name: 'Azure DNS', desc: 'DNS service', icon: '🔀', color: '#8C4FFF', tf: 'azurerm_dns_zone' },
      { id: 'az_apim', name: 'API Management', desc: 'API gateway', icon: '🔌', color: '#8C4FFF', tf: 'azurerm_api_management' },
    ],
    security: [
      { id: 'az_aad', name: 'Azure AD', desc: 'Identity & access', icon: '🔐', color: '#DD344C', tf: 'azurerm_active_directory_domain_service' },
      { id: 'az_b2c', name: 'Azure AD B2C', desc: 'User auth', icon: '👤', color: '#DD344C', tf: 'azurerm_aadb2c_directory' },
      { id: 'az_kv', name: 'Key Vault', desc: 'Secret management', icon: '🗝️', color: '#DD344C', tf: 'azurerm_key_vault' },
    ],
    messaging: [
      { id: 'az_servicebus', name: 'Service Bus', desc: 'Message queue', icon: '📬', color: '#FF4F8B', tf: 'azurerm_servicebus_queue' },
      { id: 'az_eventhubs', name: 'Event Hubs', desc: 'Event streaming', icon: '🌊', color: '#FF4F8B', tf: 'azurerm_eventhub' },
    ]
  },
  gcp: {
    compute: [
      { id: 'gce', name: 'Compute Engine', desc: 'Virtual machines', icon: '🖥️', color: '#4285F4', tf: 'google_compute_instance' },
      { id: 'gcf', name: 'Cloud Functions', desc: 'Serverless', icon: '⚡', color: '#4285F4', tf: 'google_cloudfunctions_function' },
      { id: 'gcr', name: 'Cloud Run', desc: 'Container runtime', icon: '📦', color: '#4285F4', tf: 'google_cloud_run_service' },
      { id: 'gke', name: 'GKE', desc: 'Kubernetes engine', icon: '☸️', color: '#4285F4', tf: 'google_container_cluster' },
      { id: 'gae', name: 'App Engine', desc: 'PaaS platform', icon: '🌱', color: '#4285F4', tf: 'google_app_engine_application' },
    ],
    storage: [
      { id: 'gcs', name: 'Cloud Storage', desc: 'Object storage', icon: '🗄️', color: '#34A853', tf: 'google_storage_bucket' },
      { id: 'gpd', name: 'Persistent Disk', desc: 'Block storage', icon: '💾', color: '#34A853', tf: 'google_compute_disk' },
      { id: 'gfs', name: 'Filestore', desc: 'File storage', icon: '📁', color: '#34A853', tf: 'google_filestore_instance' },
    ],
    database: [
      { id: 'gcloudsql', name: 'Cloud SQL', desc: 'Managed SQL', icon: '🗃️', color: '#3B48CC', tf: 'google_sql_database_instance' },
      { id: 'firestore', name: 'Firestore', desc: 'NoSQL database', icon: '🔥', color: '#3B48CC', tf: 'google_firestore_index' },
      { id: 'bigtable', name: 'Bigtable', desc: 'Wide column DB', icon: '⚡💾', color: '#3B48CC', tf: 'google_bigtable_instance' },
      { id: 'bigquery', name: 'BigQuery', desc: 'Data warehouse', icon: '📊', color: '#3B48CC', tf: 'google_bigquery_dataset' },
      { id: 'memorystore', name: 'Memorystore', desc: 'In-memory cache', icon: '⚡🗃️', color: '#3B48CC', tf: 'google_redis_instance' },
    ],
    networking: [
      { id: 'gvpc', name: 'VPC Network', desc: 'Private network', icon: '🌐', color: '#8C4FFF', tf: 'google_compute_network' },
      { id: 'gclb', name: 'Cloud Load Balancing', desc: 'Load balancer', icon: '⚖️', color: '#8C4FFF', tf: 'google_compute_backend_service' },
      { id: 'gcdn', name: 'Cloud CDN', desc: 'CDN service', icon: '🌍', color: '#8C4FFF', tf: 'google_compute_backend_bucket' },
      { id: 'gcldns', name: 'Cloud DNS', desc: 'DNS service', icon: '🔀', color: '#8C4FFF', tf: 'google_dns_managed_zone' },
      { id: 'gapigw', name: 'Cloud Endpoints', desc: 'API management', icon: '🔌', color: '#8C4FFF', tf: 'google_endpoints_service' },
    ],
    security: [
      { id: 'giam', name: 'Cloud IAM', desc: 'Identity & access', icon: '🔐', color: '#DD344C', tf: 'google_project_iam_member' },
      { id: 'gkms', name: 'Cloud KMS', desc: 'Key management', icon: '🗝️', color: '#DD344C', tf: 'google_kms_key_ring' },
    ],
    messaging: [
      { id: 'gpubsub', name: 'Pub/Sub', desc: 'Pub/sub messaging', icon: '📢', color: '#FF4F8B', tf: 'google_pubsub_topic' },
      { id: 'gdataflow', name: 'Dataflow', desc: 'Stream processing', icon: '🌊', color: '#FF4F8B', tf: 'google_dataflow_job' },
    ]
  }
};

// Translation map: AWS -> Azure and AWS -> GCP
const TRANSLATION_MAP = {
  // AWS -> Azure
  aws_to_azure: {
    ec2: { id: 'az_vm', name: 'Virtual Machines', note: 'Equivalent VM service' },
    lambda: { id: 'az_functions', name: 'Azure Functions', note: 'Serverless compute' },
    ecs: { id: 'az_aci', name: 'Container Instances', note: 'Container hosting' },
    eks: { id: 'az_aks', name: 'AKS', note: '1:1 Kubernetes mapping' },
    beanstalk: { id: 'az_appservice', name: 'App Service', note: 'Managed PaaS' },
    s3: { id: 'az_blob', name: 'Blob Storage', note: 'Object storage equivalent' },
    ebs: { id: 'az_disk', name: 'Managed Disks', note: 'Block storage equivalent' },
    efs: { id: 'az_files', name: 'Azure Files', note: 'File share equivalent' },
    rds: { id: 'az_sqldb', name: 'SQL Database', note: 'Managed relational DB' },
    dynamodb: { id: 'az_cosmos', name: 'Cosmos DB', note: 'NoSQL with multi-model' },
    aurora: { id: 'az_sqldb', name: 'SQL Database Hyperscale', note: 'High-performance SQL' },
    elasticache: { id: 'az_redis', name: 'Azure Cache for Redis', note: 'Redis cache service' },
    redshift: { id: 'az_synapse', name: 'Azure Synapse', note: 'Analytics + DW' },
    vpc: { id: 'az_vnet', name: 'Virtual Network', note: 'Network isolation' },
    alb: { id: 'az_lb', name: 'Load Balancer', note: 'L7 load balancing' },
    cloudfront: { id: 'az_cdn', name: 'Azure CDN', note: 'Global CDN' },
    route53: { id: 'az_dns', name: 'Azure DNS', note: 'DNS management' },
    apigateway: { id: 'az_apim', name: 'API Management', note: 'Full API lifecycle' },
    iam: { id: 'az_aad', name: 'Azure Active Directory', note: 'Identity platform' },
    cognito: { id: 'az_b2c', name: 'Azure AD B2C', note: 'Consumer identity' },
    kms: { id: 'az_kv', name: 'Key Vault', note: 'Secret & key management' },
    sqs: { id: 'az_servicebus', name: 'Service Bus Queues', note: 'Message queue' },
    sns: { id: 'az_servicebus', name: 'Service Bus Topics', note: 'Pub/sub messaging' },
    kinesis: { id: 'az_eventhubs', name: 'Event Hubs', note: 'Real-time data streaming' },
    cloudwatch: { id: 'az_monitor', name: 'Azure Monitor', note: 'Monitoring & alerts' },
  },
  // AWS -> GCP
  aws_to_gcp: {
    ec2: { id: 'gce', name: 'Compute Engine', note: 'Equivalent VM service' },
    lambda: { id: 'gcf', name: 'Cloud Functions', note: 'Serverless compute' },
    ecs: { id: 'gcr', name: 'Cloud Run', note: 'Container hosting' },
    eks: { id: 'gke', name: 'GKE', note: '1:1 Kubernetes mapping' },
    beanstalk: { id: 'gae', name: 'App Engine', note: 'Managed PaaS platform' },
    s3: { id: 'gcs', name: 'Cloud Storage', note: 'Object storage equivalent' },
    ebs: { id: 'gpd', name: 'Persistent Disk', note: 'Block storage equivalent' },
    efs: { id: 'gfs', name: 'Filestore', note: 'Managed NFS' },
    rds: { id: 'gcloudsql', name: 'Cloud SQL', note: 'Managed relational DB' },
    dynamodb: { id: 'firestore', name: 'Firestore', note: 'Serverless NoSQL' },
    aurora: { id: 'gcloudsql', name: 'Cloud SQL (HA)', note: 'High-availability SQL' },
    elasticache: { id: 'memorystore', name: 'Memorystore', note: 'Managed Redis/Memcached' },
    redshift: { id: 'bigquery', name: 'BigQuery', note: 'Serverless data warehouse' },
    vpc: { id: 'gvpc', name: 'VPC Network', note: 'Virtual private cloud' },
    alb: { id: 'gclb', name: 'Cloud Load Balancing', note: 'Global load balancing' },
    cloudfront: { id: 'gcdn', name: 'Cloud CDN', note: 'Global CDN' },
    route53: { id: 'gcldns', name: 'Cloud DNS', note: 'DNS management' },
    apigateway: { id: 'gapigw', name: 'Cloud Endpoints', note: 'API gateway' },
    iam: { id: 'giam', name: 'Cloud IAM', note: 'Identity & access' },
    cognito: { id: 'giam', name: 'Firebase Auth / IAM', note: 'Use Firebase for consumer auth' },
    kms: { id: 'gkms', name: 'Cloud KMS', note: 'Key management service' },
    sqs: { id: 'gpubsub', name: 'Cloud Pub/Sub', note: 'Message queue via subscription' },
    sns: { id: 'gpubsub', name: 'Cloud Pub/Sub', note: 'Topics and subscriptions' },
    kinesis: { id: 'gdataflow', name: 'Dataflow + Pub/Sub', note: 'Stream processing' },
    cloudwatch: { id: 'gmonitoring', name: 'Cloud Monitoring', note: 'Metrics & alerts' },
  },
  // Azure -> AWS
  azure_to_aws: {
    az_vm: { id: 'ec2', name: 'EC2', note: 'Equivalent VM service' },
    az_functions: { id: 'lambda', name: 'Lambda', note: 'Serverless compute' },
    az_aci: { id: 'ecs', name: 'ECS (Fargate)', note: 'Managed containers' },
    az_aks: { id: 'eks', name: 'EKS', note: '1:1 Kubernetes mapping' },
    az_appservice: { id: 'beanstalk', name: 'Elastic Beanstalk', note: 'Managed PaaS' },
    az_blob: { id: 's3', name: 'S3', note: 'Object storage equivalent' },
    az_disk: { id: 'ebs', name: 'EBS', note: 'Block storage equivalent' },
    az_files: { id: 'efs', name: 'EFS', note: 'File storage equivalent' },
    az_sqldb: { id: 'rds', name: 'RDS', note: 'Managed relational DB' },
    az_cosmos: { id: 'dynamodb', name: 'DynamoDB', note: 'NoSQL database' },
    az_redis: { id: 'elasticache', name: 'ElastiCache', note: 'Redis compatible cache' },
    az_synapse: { id: 'redshift', name: 'Redshift', note: 'Data warehouse' },
    az_vnet: { id: 'vpc', name: 'VPC', note: 'Virtual private cloud' },
    az_lb: { id: 'alb', name: 'ALB', note: 'Application load balancer' },
    az_cdn: { id: 'cloudfront', name: 'CloudFront', note: 'Global CDN' },
    az_dns: { id: 'route53', name: 'Route 53', note: 'DNS management' },
    az_apim: { id: 'apigateway', name: 'API Gateway', note: 'API management' },
    az_aad: { id: 'iam', name: 'IAM', note: 'Identity & access' },
    az_b2c: { id: 'cognito', name: 'Cognito', note: 'Consumer identity' },
    az_kv: { id: 'kms', name: 'KMS + Secrets Manager', note: 'Key & secret management' },
    az_servicebus: { id: 'sqs', name: 'SQS + SNS', note: 'Queuing & pub/sub' },
    az_eventhubs: { id: 'kinesis', name: 'Kinesis', note: 'Event streaming' },
  },
  // GCP -> AWS
  gcp_to_aws: {
    gce: { id: 'ec2', name: 'EC2', note: 'Equivalent VM service' },
    gcf: { id: 'lambda', name: 'Lambda', note: 'Serverless compute' },
    gcr: { id: 'ecs', name: 'ECS (Fargate)', note: 'Container hosting' },
    gke: { id: 'eks', name: 'EKS', note: '1:1 Kubernetes mapping' },
    gae: { id: 'beanstalk', name: 'Elastic Beanstalk', note: 'Managed PaaS' },
    gcs: { id: 's3', name: 'S3', note: 'Object storage equivalent' },
    gpd: { id: 'ebs', name: 'EBS', note: 'Block storage' },
    gfs: { id: 'efs', name: 'EFS', note: 'File storage' },
    gcloudsql: { id: 'rds', name: 'RDS', note: 'Managed relational DB' },
    firestore: { id: 'dynamodb', name: 'DynamoDB', note: 'NoSQL database' },
    bigtable: { id: 'dynamodb', name: 'DynamoDB', note: 'Wide-column via DynamoDB' },
    bigquery: { id: 'redshift', name: 'Redshift', note: 'Data warehouse' },
    memorystore: { id: 'elasticache', name: 'ElastiCache', note: 'Managed Redis' },
    gvpc: { id: 'vpc', name: 'VPC', note: 'Virtual private cloud' },
    gclb: { id: 'alb', name: 'ALB', note: 'Load balancing' },
    gcdn: { id: 'cloudfront', name: 'CloudFront', note: 'CDN service' },
    gcldns: { id: 'route53', name: 'Route 53', note: 'DNS management' },
    gapigw: { id: 'apigateway', name: 'API Gateway', note: 'API management' },
    giam: { id: 'iam', name: 'IAM', note: 'Identity & access' },
    gkms: { id: 'kms', name: 'KMS', note: 'Key management' },
    gpubsub: { id: 'sns', name: 'SNS + SQS', note: 'Pub/sub + queuing' },
    gdataflow: { id: 'kinesis', name: 'Kinesis Data Streams', note: 'Stream processing' },
  }
};

// Get all services for a cloud flattened
function getAllServices(cloud) {
  const result = [];
  const cats = CLOUD_SERVICES[cloud];
  for (const cat in cats) {
    cats[cat].forEach(s => result.push({ ...s, category: cat }));
  }
  return result;
}

// Get translation key
function getTranslationKey(sourceCloud, targetCloud) {
  if (sourceCloud === 'aws' && targetCloud === 'azure') return 'aws_to_azure';
  if (sourceCloud === 'aws' && targetCloud === 'gcp') return 'aws_to_gcp';
  if (sourceCloud === 'azure' && targetCloud === 'aws') return 'azure_to_aws';
  if (sourceCloud === 'gcp' && targetCloud === 'aws') return 'gcp_to_aws';
  // For other pairs, route through AWS
  return null;
}
