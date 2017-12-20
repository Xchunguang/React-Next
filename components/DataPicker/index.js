import React from 'react';
import { DatePicker } from 'antd';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

function onChange(date, dateString) {
  console.log(date, dateString);
}
class DataPicker extends React.Component{
	render(){
		return (
 			<div className='container'>
	    		<DatePicker onChange={onChange} />
	  		</div>
		)
	}
}
export default DataPicker;


