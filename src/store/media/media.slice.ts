import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'types';
import { RootState } from '..';

interface DeviceStatus {
  microphone: boolean;
  speaker: boolean;
}

export interface MediaState {
  type: 'audio' | 'video' | null;
  status: 'idle' | 'offering' | 'calling' | 'answering' | 'producing'; // producing: 在answering之后calling之前， 通知呼叫方我已接受通话
  loading: boolean;
  timer: NodeJS.Timer | null;
  targetUser: Omit<User, 'friends'> | null;
  localMediaId: string;
  remoteMediaId: string;
  answerData: {
    remoteSDP: RTCSessionDescriptionInit;
    from: User;
    type: 'audio' | 'video';
  } | null;
  localDevices: DeviceStatus;
  remoteDevices: DeviceStatus;
}

const initialState: MediaState = {
  type: null,
  status: 'idle',
  loading: false,
  timer: null,
  targetUser: null,
  localMediaId: '',
  remoteMediaId: '',
  answerData: null,
  localDevices: {
    microphone: false,
    speaker: false,
  },
  remoteDevices: {
    microphone: false,
    speaker: false,
  },
};

const slice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setType(state, action: PayloadAction<MediaState['type']>) {
      state.type = action.payload;
    },
    setStatus(state, action: PayloadAction<MediaState['status']>) {
      state.status = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setTimer(state, action: PayloadAction<MediaState['timer']>) {
      state.timer = action.payload;
    },
    setTargetUser(state, action: PayloadAction<MediaState['targetUser']>) {
      state.targetUser = action.payload;
    },
    setLocalMediaId(state, action: PayloadAction<string>) {
      state.localMediaId = action.payload;
    },
    setRemoteMediaId(state, action: PayloadAction<string>) {
      state.remoteMediaId = action.payload;
    },
    setAnswerData(state, action: PayloadAction<MediaState['answerData']>) {
      state.answerData = action.payload;
    },
    setLocalDevices(state, action: PayloadAction<Partial<DeviceStatus>>) {
      state.localDevices.microphone =
        action.payload.microphone ?? state.localDevices.microphone;
      state.localDevices.speaker =
        action.payload.speaker ?? state.localDevices.speaker;
    },
    setRemoteDevices(state, action: PayloadAction<Partial<DeviceStatus>>) {
      state.remoteDevices.microphone =
        action.payload.microphone ?? state.remoteDevices.microphone;
      state.remoteDevices.speaker =
        action.payload.speaker ?? state.remoteDevices.speaker;
    },
  },
});

export const selectMedia = (state: RootState) => state.media;
export const {
  setType,
  setStatus,
  setLoading,
  setTimer,
  setTargetUser,
  setLocalMediaId,
  setRemoteMediaId,
  setAnswerData,
  setLocalDevices,
  setRemoteDevices,
} = slice.actions;
export default slice.reducer;
