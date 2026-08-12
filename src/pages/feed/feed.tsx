import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeeds,
  selectFeedOrders,
  selectFeedLoading
} from '../../services/slices/feedSlice';
import { FeedUI } from '@ui-pages';
import { Preloader } from '../../components/ui/preloader';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedLoading);

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  const handleUpdate = () => {
    dispatch(getFeeds());
  };

  if (isLoading) return <Preloader />;

  return <FeedUI orders={orders} handleGetFeeds={handleUpdate} />;
};
