import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";

export interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome aboard, {name}!</Preview>
      <Body style={{ fontFamily: "system-ui, sans-serif", background: "#fff" }}>
        <Container style={{ padding: "32px", maxWidth: "560px" }}>
          <Heading>Welcome, {name}!</Heading>
          <Text>Thanks for joining. We&apos;re glad to have you.</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default WelcomeEmail;
