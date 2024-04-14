

import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import axios from 'axios'; // Import Axios for HTTP requests

const RequestCounts = () => {
  const [loading, setLoading] = useState(true);
  const [dayCount, setDayCount] = useState(0);
  const [monthCount, setMonthCount] = useState(0);
  const [yearCount, setYearCount] = useState(0);

  useEffect(() => {
    // Fetch request counts from backend when component mounts
    fetchRequestCounts();
  }, []);

  const fetchRequestCounts = async () => {
    try {
      // Make HTTP requests to fetch counts from backend
      const dayResponse = await axios.get('/requests/day');
      const monthResponse = await axios.get('/requests/month');
      const yearResponse = await axios.get('/requests/year');

      // Update component state with fetched counts
      setDayCount(dayResponse.data.count);
      setMonthCount(monthResponse.data.count);
      setYearCount(yearResponse.data.count);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching request counts:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View>
      <Text>Requests Today: {dayCount}</Text>
      <Text>Requests This Month: {monthCount}</Text>
      <Text>Requests This Year: {yearCount}</Text>
    </View>
  );
};

export default RequestCounts;
