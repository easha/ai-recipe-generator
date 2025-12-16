import { defineBackend } from "@aws-amplify/backend";
import { data } from "./data/resource";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { auth } from "./auth/resource";

const backend = defineBackend({
  auth,
  data,
});

const bedrockDataSource = backend.data.resources.graphqlApi.addHttpDataSource(
  "bedrockDS",
  // CHANGE 1: Use the us-west-2 endpoint
  "https://bedrock-runtime.us-west-2.amazonaws.com", 
  {
    authorizationConfig: {
      // CHANGE 2: Change signing region to us-west-2
      signingRegion: "us-west-2", 
      signingServiceName: "bedrock",
    },
  }
);

bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    resources: [
      // CHANGE 3: Update the ARN to use us-west-2
      "arn:aws:bedrock:us-west-2::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0",
    ],
    actions: ["bedrock:InvokeModel"],
  })
);