import React, { useState } from "react";
import {
  Box,
  Heading,
  HStack,
  IconButton,
  Editable,
  EditablePreview,
  EditableInput,
} from "@chakra-ui/react";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu";

const CustomerProfile: React.FC = () => {
  // Editable fields' states (for demo purposes)
  const [name, setName] = useState("Enter customer name");
  const [email, setEmail] = useState("Enter customer email");
  const [password, setPassword] = useState("Enter password");
  const [phone, setPhone] = useState("Enter phone number");


  // Render editable fields
  const renderEditableField = (label: string, value: string, setValue: React.Dispatch<React.SetStateAction<string>>) => (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" mb={6}>
      <Heading as="h3" size="md" mb={2}>
        {label}
      </Heading>
      <Editable.Root defaultValue={value} onSubmit={(nextValue) => setValue(nextValue)}>
        <HStack>
          <EditablePreview />
          <EditableInput />
          <Editable.Control>
            <Editable.EditTrigger asChild>
              <IconButton variant="ghost" size="xs" aria-label="Edit">
                <LuPencilLine />
              </IconButton>
            </Editable.EditTrigger>
            <Editable.CancelTrigger asChild>
              <IconButton variant="outline" size="xs" aria-label="Cancel">
                <LuX />
              </IconButton>
            </Editable.CancelTrigger>
            <Editable.SubmitTrigger asChild>
              <IconButton variant="outline" size="xs" aria-label="Save">
                <LuCheck />
              </IconButton>
            </Editable.SubmitTrigger>
          </Editable.Control>
        </HStack>
      </Editable.Root>
    </Box>
  );

  return (
    <>
      <Box mb={8}>
        <Heading as="h2" size="lg" mb={4} color="teal.500">
          Customer Profile
        </Heading>
      </Box>

      {/* Editable Fields */}
      {renderEditableField("Name", name, setName)}
      {renderEditableField("Email", email, setEmail)}
      {renderEditableField("Password", password, setPassword)}
      {renderEditableField("Phone Number", phone, setPhone)}
    </>
  );
};

export default CustomerProfile;
