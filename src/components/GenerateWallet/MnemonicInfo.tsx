import Box from '@mui/material/Box'
import SpaIcon from '@mui/icons-material/Spa';

interface Props {
  mnemonicSeed: string,
  language?: string | undefined,
}

const MnemonicInfo = (props: Props): JSX.Element => {
  return (
    <Box mt="2rem">
      <Box
        mb="0.2rem"
        display="flex"
        alignItems="center"
      >
        <SpaIcon/>
        <i>Recovery Seed phrase</i>
      </Box>
      <Box>
        <Box
          border={2}
          borderRadius="8px"
          //borderColor="#ebc19c"
          p="1rem"
        >
          <h2>
            {props.mnemonicSeed}
          </h2>
        </Box>
      </Box>
      <Box
        fontSize="1.3rem"
        mt="2rem"
      >
        <p>
          Please save these 12 words on paper (order is important).
          This seed will allow you to recover your wallet in case of
          computer failure.
        </p>
        <Box
          component="h4"
          mt="1rem"
        >
          WARNING:
        </Box>
        <Box
          component="ul"
          mt="0.3rem"
          pl="2.5rem"
        >
          <li>Never disclose your seed.</li>
          <li>Never type it on a website.</li>
          <li>Do not store it electronically.</li>
          <li>
            In case you decide to store it electronically anyway: try
            to store it in an encrypted way so that only you can decrypt
            it and access this seed phrase.
          </li>
        </Box>
      </Box>
    </Box>
  );
}

export default MnemonicInfo;
