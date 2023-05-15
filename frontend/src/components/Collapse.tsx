import '@/dashboard/Dashboard.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

type openFunc = (val: boolean) => void;

type Props = {
    title: string,
    setOpen: openFunc,
    open: boolean
}

const Collapse = ({title, setOpen, open}: Props) => {
    return (
      <div className='collapse' onClick={() => {setOpen(!open)}}>
        <b className='collapse-title'>{title}</b>
        <div className='svg-icon'>{open ? <KeyboardArrowDownIcon/> : <KeyboardArrowUpIcon/>}</div>
      </div>
    );
}

export default Collapse;
