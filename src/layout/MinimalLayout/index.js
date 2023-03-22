import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// project imports
import Customization from '../Customization';
import { SET_MENU, SET_LOADER } from 'store/actions';
import BlockUI from 'ui-component/block-ui/block-ui';

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout = () => {
    const loader = useSelector((state) => state.customization.loader);
    return (
        <>
            <Outlet />
            {/* <Customization /> */}
            <BlockUI blocking={loader} />
        </>
    );
};

export default MinimalLayout;
