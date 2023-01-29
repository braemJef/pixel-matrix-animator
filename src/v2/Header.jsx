import React from 'react';
import {
  MenuTrigger,
  ActionButton,
  Menu,
  Item,
  View,
  Flex,
  Section,
  Text,
} from '@adobe/react-spectrum';

function Header() {
  return (
    <View
      height="size-400"
      paddingX="size-150"
      paddingY="size-50"
      borderBottomWidth="thin"
      borderBottomColor="mid"
    >
      <Flex gap="size-50">
        <MenuTrigger>
          <ActionButton isQuiet height="size-300">
            File
          </ActionButton>
          <Menu>
            <Section>
              <Item>
                <Text>Open File...</Text>
              </Item>
            </Section>
            <Section>
              <Item>
                <Text>Save</Text>
              </Item>
              <Item>
                <Text>Export</Text>
              </Item>
            </Section>
          </Menu>
        </MenuTrigger>
        <MenuTrigger>
          <ActionButton isQuiet height="size-300">
            Edit
          </ActionButton>
          <Menu>
            <Item>
              <Text>Undo</Text>
            </Item>
            <Item>
              <Text>Redo</Text>
            </Item>
          </Menu>
        </MenuTrigger>
        <MenuTrigger>
          <ActionButton isQuiet height="size-300">
            Import
          </ActionButton>
          <Menu>
            <Item>
              <Text>Image</Text>
            </Item>
            <Item>
              <Text>Gif</Text>
            </Item>
          </Menu>
        </MenuTrigger>
      </Flex>
    </View>
  );
}

export default Header;
