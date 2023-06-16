import { Box } from '@chakra-ui/react';

interface CustomBoxProps {
  children: React.ReactNode;
}

const CustomBox: React.FC<CustomBoxProps> = ({ children }) => {
  return (
    <Box maxW="800px" mx="auto" my={8}>
      {children}
    </Box>
  );
};

export default CustomBox;
