import { Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react"

const SearchModel = ({isOpen, onClose}) => {
  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset='slideInBottom'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Search your product</ModalHeader>

          <ModalCloseButton _hover={{bgColor: "blue.50"}}/>
          
          <ModalBody pb={6}>
            <FormControl>
                <Input type="text" height={'45px'} placeholder="search..."/>
            </FormControl>
          </ModalBody>
          
        </ModalContent>
      </Modal>
  )
}

export default SearchModel