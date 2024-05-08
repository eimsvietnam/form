import React, { useState, useEffect, useRef  } from 'react';
import {
  ChakraProvider,
  Container,
  VStack,
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
  Input,
  Grid,
  GridItem,
  Button,
  Box,
  Image,
  useDisclosure,
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay 
} from '@chakra-ui/react';

function App() {
  const cancelRef = useRef();
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSendingData, setIsSendingData] = useState(false);
  const [selectedExhibition, setSelectedExhibition] = useState('');
  const [imageContainer, setImageContainer] = useState('');
  const [alertData, setAlertData] = useState({
    title: "",
    description: "",
    status: ""
  });
  const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();
  const [userData, setUserData] = useState({
    email: '',
    company: '',
    name: '',
    position: '',
    address: '',
    phone: '',
    website: '',
    note: '',
    pic: '',
    refresh: false
  });

  useEffect(() => {
    async function fetchExhibitions() {
      try {
        const response = await fetch('https://b2b-n0r5.onrender.com/users/exhibition');
        const data = await response.json();
        if (data.success) {
          setExhibitions(data.data);
          setLoading(false);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        setAlertData({
          title: "ERROR!",
          description: "Fail to connect server!",
          status: "error"
        });
        onOpenAlert() || alert("Fail to connect server!");
        setLoading(false);
        return;
      }
    }

    fetchExhibitions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRefresh = (e) => {
    setImageContainer(JSON.parse(selectedExhibition).cardLink)
    setUserData({
      email: '',
      company: '',
      name: '',
      position: '',
      address: '',
      phone: '',
      website: '',
      note: '',
      refresh: false
    })
  };

  const handleDownload = (e) => {
    if (imageContainer) {
      const link = document.createElement('a');
      link.href = imageContainer;
      link.download = 'image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSubmit = async () => {
    setIsSendingData(true);
    try {
      const response = await fetch('https://b2b-n0r5.onrender.com/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          venue: {
            time: JSON.parse(selectedExhibition).time,
            located: JSON.parse(selectedExhibition).location,
            cardLink: JSON.parse(selectedExhibition).cardLink
          },
        }),
      });
      const data = await response.json();
      if (data.success) {
        setAlertData({
          title: "Success!",
          description: "Data submitted successfully!",
          status: "success"
        });
        onOpenAlert();
        setImageContainer(data.data)
        setUserData({
          ...userData,
          refresh: true
        })
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setAlertData({
        title: "Warning!",
        description: `Error submitting data: ${error.message}`,
        status: "warning"
      });
      onOpenAlert();
    }
    setIsSendingData(false);
  };

  return (
    <ChakraProvider>
      <AlertDialog
        isOpen={isOpenAlert}
        leastDestructiveRef={cancelRef}
        onClose={onCloseAlert}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              {alertData.title}
            </AlertDialogHeader>

            <AlertDialogBody>
              {alertData.description}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseAlert}>
                OK
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Grid templateColumns="repeat(2, 1fr)" gap={2}  mt="20">
        <GridItem w="100%">
          <VStack>
            <Container maxW="md" bg="white" color="">
              <FormControl>
                <FormLabel>Please select exhibition</FormLabel>
                <Select
                  placeholder='Select option'
                  name="exhibition"
                  onChange={(e) => {
                    if(e.target.value){
                      setSelectedExhibition(e.target.value)
                      setImageContainer(JSON.parse(e.target.value).cardLink)
                    }
                  }}
                  value={selectedExhibition}
                >
                  {loading ? (
                    <option value="{cardLink:''}">Loading...</option>
                  ) : (
                    exhibitions.map((exhibition) => (
                      <option key={exhibition._id} value={JSON.stringify(exhibition)}>
                        {exhibition.abbreviation}
                      </option>
                    ))
                  )}
                </Select>
                <FormHelperText>Must choose.</FormHelperText>
              </FormControl>

              <FormControl mt="50px" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  placeholder="Email"
                  value={userData.email}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mt="10px" isRequired>
                <FormLabel>Company</FormLabel>
                <Input
                  name="company"
                  placeholder="Tên công ty"
                  value={userData.company}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mt="10px" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  placeholder="Họ tên"
                  value={userData.name}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mt="10px" isRequired>
                <FormLabel>Position</FormLabel>
                <Input
                  name="position"
                  placeholder="Chức vụ"
                  value={userData.position}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mt="10px">
                <FormLabel>Address</FormLabel>
                <Input
                  name="address"
                  placeholder="Địa chỉ"
                  value={userData.address}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mt="10px" isRequired>
                <FormLabel>Phone</FormLabel>
                <Input
                  name="phone"
                  placeholder="Số điện thoại"
                  value={userData.phone}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mt="10px">
                <FormLabel>Website</FormLabel>
                <Input
                  name="website"
                  placeholder="Website"
                  value={userData.website}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mt="10px">
                <FormLabel>Note</FormLabel>
                <Input
                  name="note"
                  placeholder="Ngành nghề"
                  value={userData.note}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mt="10px">
                <FormLabel>PIC</FormLabel>
                <Input
                  name="pic"
                  placeholder="Nhân viên"
                  value={userData.pic}
                  onChange={handleChange}
                />
              </FormControl>

              <Button
                mt="20px"
                isLoading={isSendingData}
                loadingText="Submitting"
                colorScheme="teal"
                variant="outline"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Container>
          </VStack>
        </GridItem>
        <GridItem>
          <Box boxSize='sm'>
          {imageContainer && (
            <Image src={imageContainer} id='image-container' alt='CARD' />
          )}

          {userData.refresh && (
            <>
              <Button mr='10' colorScheme='blue'
                onClick={handleDownload}
              >Download</Button>
              <Button mr='10' colorScheme='yellow'
                onClick={handleRefresh}
              >Refresh</Button>
            </>
            
          )}
          </Box>
        </GridItem>
      </Grid>
    </ChakraProvider>
  );
}

export default App;
