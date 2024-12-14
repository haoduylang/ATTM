import { Box, Heading } from "@chakra-ui/react";
import React from "react";

const NavTitle = (props) => {
  const { title } = props;

  return (
    <Box paddingBottom="1.25rem" display="flex" alignItems="center" justifyContent="space-between">
      <Heading as="h3" fontSize="1.25rem" lineHeight="1.75rem">
        {title}
      </Heading>
    </Box>
  );
};

export default NavTitle;
