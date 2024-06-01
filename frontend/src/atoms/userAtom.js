import {atom} from 'recoil';

const userAtom = atom({
    key: 'userAtom',
    default: JSON.parse(localStorage.getItem('user-details')),
});

export default userAtom;