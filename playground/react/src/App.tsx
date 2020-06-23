import React, { useState } from 'react';
import Button from './artifacts/react/renovation/button';
import DataGrid from './artifacts/react/renovation/data_grid/data_grid';

const data = [{key: 1, field1: '11', field2: '12', field3: '13' },{ key: 2, field1: '21', field2: '22', field3: '23' }];
const dataSource = { store: { type: 'array', key:'key', data} };

function App() {
    const [visible, setVisible] = useState(true);
    const [columns, setColumns] = useState([
        {dataField: 'key', visible: true},
        {dataField: 'field1', visible: true},
        {dataField: 'field2', visible: true},
    ]);
        return (
        <>
        <Button
            text={'Toggle column visible'}
            onClick={() => {
                const [column, miodifiedColums, ...restColumns] = columns;
                setColumns([column, {...miodifiedColums, visible: !miodifiedColums.visible}, ...restColumns]);
            }}
        ></Button>
        <Button
            text={'Add to center'}
            onClick={() => {
                const [column, ...restColumns] = columns;
                setColumns([column, { dataField: 'field3', visible: true }, ...restColumns]);
            }}
        ></Button>
        <Button
            text={'Delete from center'}
            onClick={() => {
                const [column, _, ...restColumns] = columns;
                setColumns([column, ...restColumns]);
            }}
        ></Button>
        <DataGrid columns={columns} dataSource={dataSource}></DataGrid>
        {/* <DataGrid datsSource={dataSource}>
            {
                columns.map(c => <GridColums {...c}>)
            }
        </DataGrid> */}
        <Button
            text={'Toggle visible'}
            onClick={() => {
                setVisible(!visible)
            }}
        ></Button>
        {/* <DataGrid dataSource={dataSource}>
            <Column dataField={'key'} visible={true}></Column>
            <Column dataField={'field1'} visible={visible}></Column>
        </DataGrid> */}
        </>
    );
}

export default App;
