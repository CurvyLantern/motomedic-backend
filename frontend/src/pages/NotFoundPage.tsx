import { Text, Box, Center } from "@mantine/core";

const NotFoundPage = () => {
  return (
    <Box
      w="100vw"
      h="100vh">
      <Center h={"100%"}>
        <Text
          size={"lg"}
          fz={100}
          fw={600}
          color="red">
          404
        </Text>
      </Center>
    </Box>
  );
};

export default NotFoundPage;
