import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';

import { calculateTime } from './utils/CommonUtils';

const ProgressPrintContainer = styled.div`
    table {
        border-collapse: collapse;
        border-spacing: 0;
        width: 100%;
        border: 1px solid #ddd;
    }

    th, td {
        text-align: center;
        padding: 8px;
    }
    th {
        background-color: white;
        /* border-bottom: 1px solid gray; */
    }
`;

const ProgressPrint = ({
    currentTime,
    currentTimePercent,
    inTimePercent,
    inTime,
    outTimePercent,
    outTime,
    selectedBar,
}) => {


    return (
        <ProgressPrintContainer>
            <hr></hr>
            <div style={{ "overflowX": "auto" }}>
                <table>
                    <thead>
                        <tr>
                            <th>Current Time</th>
                            <th>In Time</th>
                            <th>Out Time</th>
                            <th>Selected Bar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{calculateTime(currentTime)}</td>
                            <td>{calculateTime(inTime)}</td>
                            <td>{calculateTime(outTime)}</td>
                            <td
                                rowSpan={3}
                                style={{"color": "blue", "fontWeight": "bold"}}
                            >
                                {(selectedBar !== null) ? selectedBar.attributes.type.value : null}
                            </td>
                        </tr>
                        <tr>
                            <td>{currentTime} s</td>
                            <td>{inTime} s</td>
                            <td>{outTime} s</td>
                        </tr>
                        <tr>
                            <td>{currentTimePercent} %</td>
                            <td>{inTimePercent} %</td>
                            <td>{outTimePercent} %</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </ProgressPrintContainer>
    );
}

export default ProgressPrint;