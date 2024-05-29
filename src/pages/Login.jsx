import { useState } from "react";
import { Container, VStack, Heading, Input, Button, Text } from "@chakra-ui/react";
import { useLogin } from "../integrations/supabase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const loginMutation = useLogin();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await loginMutation.mutateAsync({ email, password });
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Heading as="h1" size="2xl">Login</Heading>
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <Input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        {error && <Text color="red.500">{error}</Text>}
        <Button onClick={handleLogin} isLoading={loginMutation.isLoading}>Login</Button>
      </VStack>
    </Container>
  );
};

export default Login;