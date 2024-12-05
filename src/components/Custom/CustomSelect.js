import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { GoTriangleDown } from "react-icons/go";

const CustomSelect = (props) => {
  const { value, placeholder, onChange, items } = props;

  return (
    <>
      <Menu>
        <MenuButton as={Button} rightIcon={<GoTriangleDown />}>
          {items.find((x) => x.value === value)?.label || placeholder || "Choose..."}
        </MenuButton>
        <MenuList>
          {items.map((item, key) => (
            <MenuItem key={key} onClick={() => onChange(item.value)}>
              {item.label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </>
  );
};

export default CustomSelect;
