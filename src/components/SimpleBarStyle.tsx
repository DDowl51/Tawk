import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import styled from 'styled-components';

const SimpleBarStyle = styled(SimpleBar)({
  height: '100%',
  maxHeight: '100%',
  '& .simplebar-scrollbar': {
    '&:before': {
      backgroundColor: '#343a4066',
    },
    '&.simplebar-visible:before': {
      opacity: 1,
    },
  },
  '& .simplebar-track.simplebar-vertical': {
    width: 10,
  },
  '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': {
    height: 6,
  },
  '& .simplebar-mask': {
    zIndex: 'inherit',
  },
  '& .simplebar-placeholder': {
    height: '0 !important',
  },
});

export default SimpleBarStyle;
