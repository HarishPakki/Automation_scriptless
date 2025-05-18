import React from 'react';
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { testCasesTreeData } from '../../utils/excelUtils';
import './TreeView.css';

const TreeView = () => {

    const handleItemClick=(event, itemId)=>{

    };

    return (
        <Box className='tree-view-box' sx={{ minHeight: 352, minWidth: 250 }}>
            <SimpleTreeView onItemClick={handleItemClick}>
                {
                    testCasesTreeData.map((module, parentIndex)=>{
                        const testCases = module.items;
                        return (
                            <TreeItem key={parentIndex} itemId={module.id} label={module.label}>
                                {
                                    testCases.map((testCase,childrenIndex)=>{
                                        return(
                                            <TreeItem key={childrenIndex} itemId={testCase.id} label={testCase.label} />
                                        )
                                    })
                                }
                            </TreeItem>            
                        )
                    })
                }
                {/* <TreeItem itemId="grid" label="Data Grid">
                    <TreeItem itemId="grid-community" label="@mui/x-data-grid" />
                    <TreeItem itemId="grid-pro" label="@mui/x-data-grid-pro" />
                    <TreeItem itemId="grid-premium" label="@mui/x-data-grid-premium" />
                </TreeItem>
                <TreeItem itemId="pickers" label="Date and Time Pickers">
                    <TreeItem itemId="pickers-community" label="@mui/x-date-pickers" />
                    <TreeItem itemId="pickers-pro" label="@mui/x-date-pickers-pro" />
                </TreeItem>
                <TreeItem itemId="charts" label="Charts">
                    <TreeItem itemId="charts-community" label="@mui/x-charts" />
                    <TreeItem itemId="charts-pro" label="@mui/x-charts-pro" />
                </TreeItem>
                <TreeItem itemId="tree-view" label="Tree View">
                    <TreeItem itemId="tree-view-community" label="@mui/x-tree-view" />
                    <TreeItem itemId="tree-view-pro" label="@mui/x-tree-view-pro" />
                </TreeItem> */}
            </SimpleTreeView>
        </Box>
    );
}

export default TreeView;