'use client';
import { useState } from 'react';
export default function Counter() { const [value,setValue]=useState(0);return <button onClick={()=>setValue(value+1)}>点击计数：{value}</button>; }
