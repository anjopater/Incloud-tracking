import React, {Component} from 'react';
import {
    Button,
    TextArea,
    Input,
    Icon,
    Table,
    Message
} from 'semantic-ui-react';
import './Counter.css'
import DatePicker from 'react-datepicker';
import numeral from 'numeral';
import moment from 'moment';
import * as api from '../../api/track';

import 'react-datepicker/dist/react-datepicker.css';

class Counter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hour: '00',
            min: '00',
            sec: '00',
            state: '',
            totalSeconds: 0,
            description: '',
            date: '',
            manualTime: "",

            trackers: [],
            interval: '',

            term: '',
            limit: 5,

            startDate: moment(),
            endDate: moment(),

            intervalId: 0,
            errorTime: false
        }
        this.handleStartDateChange = this
            .handleStartDateChange
            .bind(this);
        this.handleEndDateChange = this
            .handleEndDateChange
            .bind(this);
    }

    componentDidMount() {
        this.fetchAllTracks();
    }

    onStart = () => {
        this.start();
    };

    start() {
        let self = this;
        let intervalId = setInterval(function () {
            self.setState({
                totalSeconds: self.state.totalSeconds += 1
            });
            self.setState({
                hour: Math.floor(self.state.totalSeconds / 3600) < 10
                    ? numeral(Math.floor(self.state.totalSeconds / 3600)).format('00')
                    : Math.floor(self.state.totalSeconds / 3600),

                min: Math.floor(self.state.totalSeconds / 60 % 60) < 10
                    ? numeral(Math.floor(self.state.totalSeconds / 60 % 60)).format('00')
                    : Math.floor(self.state.totalSeconds / 60 % 60),

                sec: parseInt(self.state.totalSeconds % 60) < 10
                    ? numeral(parseInt(self.state.totalSeconds % 60)).format('00')
                    : parseInt(self.state.totalSeconds % 60)
            });
        }, 1000);
        this.setState({intervalId: intervalId});
    }

    onPause = () => {
        clearInterval(this.state.intervalId);
        delete this.state.intervalId;
    }

    onResume = () => {
        if (!this.state.intervalId) {
            this.start();
        }
    }

    onChangeValue = (property) => (event) => {
        this.setState({[property]: event.target.value});
    }

    onSearch = (event) => {
        this.setState({term: event.target.value});
        this.searchTerm(event.target.value);
    };

    searchTerm = (term) => {
        const dataSearch = {
            data: {
                term: term,
                limit: 5
            }
        };
        api
            .fetchAllTracks(dataSearch)
            .then((res) => {
                this.setState({trackers: res.data.tracks});
            });
    };

    onSaveTrack = () => {
        if (!this.validTime()) {
            this.setState({errorTime: true});
            return false;
        } else {
            this.setState({errorTime: false});
        }

        const currentDate = new Date();
        let time = this.state.hour + ':' + this.state.min + ':' + this.state.sec;
        if (time === '00:00:00') {
            time = this.state.manualTime;
        }
        const newTrakers = this
            .state
            .trackers
            .concat({
                time: time,
                description: this.state.description,
                date: moment(currentDate).format('MMM/DD/YYYY')
            });
        this.setState({trackers: newTrakers});

        const trackData = {
            data: {
                time: `${this.state.hour}:${this.state.min}:${this.state.sec}`,
                description: this.state.description,
                date: moment(currentDate).format('MMM-DD-YYYY')
            }
        };

        api
            .saveTrack(trackData)
            .then((res) => {});
        this.clearStates();
    }

    fetchAllTracks(limit) {
        const dataSearch = {
            data: {
                term: '',
                limit: limit
                    ? limit
                    : 5
            }
        };
        api
            .fetchAllTracks(dataSearch)
            .then((res) => {
                this.setState({trackers: res.data.tracks});
            });
    };

    clearStates() {
        clearInterval(this.state.intervalId);
        this.setState({hour: '00', min: '00', sec: '00', totalSeconds: 0});
    }

    handleStartDateChange(date) {
        this.setState({
            startDate: date
        }, () => {
            const dataSearch = {
                data: {
                    startDate: date,
                    endDate: this.state.endDate,
                    limit: 5
                }
            };

            api
                .fetchAllTracks(dataSearch)
                .then((res) => {
                    this.setState({trackers: res.data.tracks});
                });
        });
    };

    handleEndDateChange(date) {
        this.setState({
            endDate: date
        }, () => {
            const dataSearch = {
                data: {
                    startDate: this.state.startDate,
                    endDate: date,
                    limit: 5
                }
            };
            api
                .fetchAllTracks(dataSearch)
                .then((res) => {
                    this.setState({trackers: res.data.tracks});
                });
        });
        this.setState({endDate: date});
    };

    onLoadMore = () => {
        this.setState({
            limit: this.state.limit + 5
        });
        this.fetchAllTracks(this.state.limit + 5);
    };

    validTime = () => {
        const time = this.state.hour + ':' + this.state.min + ':' + this.state.sec;
        if (time === "00:00:00" && (!this.state.manualTime || this.state.manualTime === "00:00:00")) {
            return false;
        }
        return true;
    }

    render() {
        const rows = this
            .state
            .trackers
            .map((tracker, index) => {
                return (
                    <Table.Row key={index}>
                        <Table.Cell colSpan='3'>
                            <Icon name='clock'/>{tracker.time}
                        </Table.Cell>
                        <Table.Cell colSpan='3'>
                            <Icon name='text'/>{tracker.description}
                        </Table.Cell>
                        <Table.Cell colSpan='3'>
                            <Icon name='clock'/>{moment(tracker.date).format('MMM/DD/YYYY')}
                        </Table.Cell>
                    </Table.Row>
                );
            });

        return (
            <div className="counter">
                <div className="time">
                    <span>{this.state.hour}</span>
                    :
                    <span>{this.state.min}</span>
                    :
                    <span>{this.state.sec}</span>
                </div>
                <div>
                    <Button primary onClick={this.onStart}>start</Button>
                    <Button primary onClick={this.onPause}>pause</Button>
                    <Button primary onClick={this.onResume}>resume</Button>
                </div>
                <div >
                    <Input
                        className={this.state.errorTime
                        ? 'error'
                        : ''}
                        placeholder="put manually the time"
                        value={this.state.manualTime}
                        onChange={this.onChangeValue('manualTime')}/>
                </div>
                <div>
                    <TextArea
                        placeholder='Add a description'
                        value={this.state.description}
                        onChange={this.onChangeValue('description')}/>
                </div>
                <Button primary onClick={this.onSaveTrack}>save track</Button>
                <div className="search">
                    <Input
                        focus
                        value={this.state.term}
                        placeholder='Search by description'
                        onChange={this.onSearch}/>
                    <DatePicker
                        selected={this.state.startDate}
                        onChange={this.handleStartDateChange}/>
                    <DatePicker selected={this.state.endDate} onChange={this.handleEndDateChange}/>
                </div>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell colSpan='3'>Tracker</Table.HeaderCell>
                            <Table.HeaderCell colSpan='3'>Description</Table.HeaderCell>
                            <Table.HeaderCell colSpan='3'>Date</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {rows}
                    </Table.Body>
                </Table>
                <a href="#" onClick={this.onLoadMore}>load more</a>
            </div>
        )
    }
}

export default Counter;