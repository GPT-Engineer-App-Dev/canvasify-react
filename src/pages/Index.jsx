import { Container, VStack } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

const Index = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Example drawing: fill the canvas with a color
    context.fillStyle = "#f0f0f0";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <canvas ref={canvasRef} style={{ border: "1px solid #000" }} />
      </VStack>
    </Container>
  );
};

export default Index;