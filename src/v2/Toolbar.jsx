import React from 'react';
import { ActionButton, View, Flex } from '@adobe/react-spectrum';

import Draw from '@spectrum-icons/workflow/Draw';
import Line from '@spectrum-icons/workflow/Remove';

function Toolbar() {
  return (
    <View padding="size-100">
      <Flex gap="size-50" direction="column">
        <ActionButton width="size-500" height="size-500" isQuiet>
          <Draw />
        </ActionButton>
        <ActionButton width="size-500" height="size-500" isQuiet>
          <Line />
        </ActionButton>
        <ActionButton width="size-500" height="size-500" isQuiet>
          <Line UNSAFE_style={{ transform: 'rotate(90deg)' }} />
        </ActionButton>
      </Flex>
    </View>
  );
}

export default Toolbar;
