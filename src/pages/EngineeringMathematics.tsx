import { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import {
    Calculator,
    TrendingUp,
    ArrowRight,
    RotateCcw,
    Info,
    ChevronDown,
    ChevronUp,
    Play,
    Eye,
    GraduationCap,
    Delete,
    History,
    Trash2,
    Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';

// Import nerdamer and its modules
import nerdamer from 'nerdamer';
import 'nerdamer/Calculus';
import 'nerdamer/Algebra';
import 'nerdamer/Solve';

// ============== STANDARD CALCULATOR COMPONENT ==============
const StandardCalculator = () => {
    const [display, setDisplay] = useState('0');
    const [equation, setEquation] = useState('');
    const [history, setHistory] = useState<{ eq: string; res: string }[]>([]);
    const [isRadians, setIsRadians] = useState(true);
    const [memory, setMemory] = useState<number>(0);

    const safeEvaluate = (expression: string) => {
        try {
            let evalString = expression
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/π/g, 'Math.PI')
                .replace(/e(?![x])/g, 'Math.E')
                .replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)')
                .replace(/sin\(/g, isRadians ? 'Math.sin(' : `Math.sin((Math.PI/180)*`)
                .replace(/cos\(/g, isRadians ? 'Math.cos(' : `Math.cos((Math.PI/180)*`)
                .replace(/tan\(/g, isRadians ? 'Math.tan(' : `Math.tan((Math.PI/180)*`)
                .replace(/log\(/g, 'Math.log10(')
                .replace(/ln\(/g, 'Math.log(')
                .replace(/\^/g, '**');

            const result = new Function('return ' + evalString)();
            return parseFloat(result.toFixed(8)).toString();
        } catch {
            return 'Error';
        }
    };

    const handlePress = (val: string) => {
        setDisplay(prev => {
            if (prev === '0' || prev === 'Error') return val;
            return prev + val;
        });
    };

    const handleOperation = (op: string) => {
        if (display === 'Error') return;
        setDisplay(prev => prev + op);
    };

    const handleFunction = (func: string) => {
        if (display === 'Error') setDisplay('0');
        setDisplay(prev => {
            const isZero = prev === '0';
            return isZero ? func + '(' : prev + func + '(';
        });
    };

    const handleClear = () => {
        setDisplay('0');
        setEquation('');
    };

    const handleDelete = () => {
        setDisplay(prev => {
            if (prev.length === 1 || prev === 'Error') return '0';
            return prev.slice(0, -1);
        });
    };

    const handleEqual = () => {
        const result = safeEvaluate(display);
        if (result !== 'Error') {
            setHistory(prev => [{ eq: display, res: result }, ...prev].slice(0, 50));
            setEquation(display + ' =');
            setDisplay(result);
        } else {
            setDisplay('Error');
        }
    };

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const key = e.key;
        if (/[0-9.]/.test(key)) handlePress(key);
        if (['+', '-', '*', '/'].includes(key)) handleOperation(key === '*' ? '×' : key === '/' ? '÷' : key);
        if (key === 'Enter') handleEqual();
        if (key === 'Backspace') handleDelete();
        if (key === 'Escape') handleClear();
        if (key === '(' || key === ')') handlePress(key);
    }, [display]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const Btn = ({ label, onClick, variant = 'default', className = '' }: { label: React.ReactNode, onClick: () => void, variant?: 'default' | 'secondary' | 'accent', className?: string }) => {
        const baseStyle = "h-12 text-base font-medium transition-all duration-200 active:scale-95";
        const variants = {
            default: "bg-secondary/50 hover:bg-secondary/80 text-foreground",
            secondary: "bg-muted/50 hover:bg-muted/80 text-muted-foreground",
            accent: "bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20",
        };

        return (
            <Button variant="ghost" className={`${baseStyle} ${variants[variant]} ${className}`} onClick={onClick}>
                {label}
            </Button>
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-xl border-primary/10">
                <CardHeader className="bg-muted/20 pb-2">
                    <div className="flex justify-between items-center text-xs text-muted-foreground px-1 h-5">
                        <span>{equation}</span>
                        <div className="flex gap-2">
                            <Button size="sm" variant={isRadians ? "default" : "outline"} className="h-6 text-xs" onClick={() => setIsRadians(true)}>RAD</Button>
                            <Button size="sm" variant={!isRadians ? "default" : "outline"} className="h-6 text-xs" onClick={() => setIsRadians(false)}>DEG</Button>
                        </div>
                    </div>
                    <div className="text-3xl font-mono font-medium text-right tracking-wider py-3 px-2 overflow-x-auto whitespace-nowrap">
                        {display}
                    </div>
                </CardHeader>
                <CardContent className="p-3">
                    <div className="grid grid-cols-5 gap-2">
                        <Btn label="MC" variant="secondary" onClick={() => setMemory(0)} />
                        <Btn label="MR" variant="secondary" onClick={() => setDisplay(memory.toString())} />
                        <Btn label="M+" variant="secondary" onClick={() => setMemory(m => m + parseFloat(display))} />
                        <Btn label="AC" variant="secondary" className="text-red-400" onClick={handleClear} />
                        <Btn label={<Delete className="w-4 h-4" />} variant="secondary" className="text-orange-400" onClick={handleDelete} />

                        <Btn label="sin" variant="secondary" onClick={() => handleFunction('sin')} />
                        <Btn label="cos" variant="secondary" onClick={() => handleFunction('cos')} />
                        <Btn label="tan" variant="secondary" onClick={() => handleFunction('tan')} />
                        <Btn label="(" variant="secondary" onClick={() => handlePress('(')} />
                        <Btn label=")" variant="secondary" onClick={() => handlePress(')')} />

                        <Btn label="ln" variant="secondary" onClick={() => handleFunction('ln')} />
                        <Btn label="log" variant="secondary" onClick={() => handleFunction('log')} />
                        <Btn label="x²" variant="secondary" onClick={() => setDisplay(p => `${p}^2`)} />
                        <Btn label="√" variant="secondary" onClick={() => handleFunction('√')} />
                        <Btn label="^" variant="secondary" onClick={() => setDisplay(p => `${p}^`)} />

                        <Btn label="7" onClick={() => handlePress('7')} />
                        <Btn label="8" onClick={() => handlePress('8')} />
                        <Btn label="9" onClick={() => handlePress('9')} />
                        <Btn label="÷" variant="default" className="bg-primary/10 text-primary" onClick={() => handleOperation('÷')} />
                        <Btn label="π" variant="secondary" onClick={() => handlePress('π')} />

                        <Btn label="4" onClick={() => handlePress('4')} />
                        <Btn label="5" onClick={() => handlePress('5')} />
                        <Btn label="6" onClick={() => handlePress('6')} />
                        <Btn label="×" variant="default" className="bg-primary/10 text-primary" onClick={() => handleOperation('×')} />
                        <Btn label="e" variant="secondary" onClick={() => handlePress('e')} />

                        <Btn label="1" onClick={() => handlePress('1')} />
                        <Btn label="2" onClick={() => handlePress('2')} />
                        <Btn label="3" onClick={() => handlePress('3')} />
                        <Btn label="-" variant="default" className="bg-primary/10 text-primary" onClick={() => handleOperation('-')} />
                        <Btn label="Ans" variant="secondary" onClick={() => history.length > 0 && setDisplay(history[0].res)} />

                        <Btn label="0" className="col-span-2" onClick={() => handlePress('0')} />
                        <Btn label="." onClick={() => handlePress('.')} />
                        <Btn label="=" variant="accent" onClick={handleEqual} />
                        <Btn label="+" variant="default" className="bg-primary/10 text-primary" onClick={() => handleOperation('+')} />
                    </div>
                </CardContent>
            </Card>

            {/* History & Constants */}
            <div className="space-y-4">
                <Card className="flex flex-col">
                    <CardHeader className="py-3 border-b">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm flex items-center gap-2"><History className="w-4 h-4" />History</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setHistory([])} disabled={history.length === 0}>
                                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-400" />
                            </Button>
                        </div>
                    </CardHeader>
                    <ScrollArea className="flex-1 p-3 h-[280px]">
                        {history.length === 0 ? (
                            <div className="text-center text-muted-foreground text-sm py-8">No calculations yet</div>
                        ) : (
                            history.map((item, i) => (
                                <div key={i} className="flex flex-col items-end p-2 rounded hover:bg-muted/50 cursor-pointer" onClick={() => setDisplay(item.res)}>
                                    <span className="text-xs text-muted-foreground">{item.eq} =</span>
                                    <span className="text-base font-mono font-medium text-primary">{item.res}</span>
                                </div>
                            ))
                        )}
                    </ScrollArea>
                </Card>

                <Card>
                    <CardHeader className="py-2">
                        <CardTitle className="text-sm flex items-center gap-2"><Settings className="w-4 h-4" />Constants</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-2 text-sm">
                        <Button variant="outline" size="sm" className="justify-between" onClick={() => handlePress('3.14159265')}>
                            <span>π</span><span className="text-xs text-muted-foreground">3.14159</span>
                        </Button>
                        <Button variant="outline" size="sm" className="justify-between" onClick={() => handlePress('2.71828182')}>
                            <span>e</span><span className="text-xs text-muted-foreground">2.71828</span>
                        </Button>
                        <Button variant="outline" size="sm" className="justify-between" onClick={() => handlePress('9.81')}>
                            <span>g</span><span className="text-xs text-muted-foreground">9.81</span>
                        </Button>
                        <Button variant="outline" size="sm" className="justify-between" onClick={() => handlePress('299792458')}>
                            <span>c</span><span className="text-xs text-muted-foreground">3.00e8</span>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// ============== CALCULUS CALCULATOR COMPONENT ==============
const CalculusCalculator = ({ isStudyMode }: { isStudyMode: boolean }) => {
    const [expression, setExpression] = useState('x^3 + 2*x^2 - x + 5');
    const [variable, setVariable] = useState('x');
    const [result, setResult] = useState<string | null>(null);
    const [steps, setSteps] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showGraph, setShowGraph] = useState(false);
    const [graphData, setGraphData] = useState<{ x: number; original: number; result: number }[]>([]);
    const [operation, setOperation] = useState<'differentiate' | 'integrate'>('differentiate');
    const [showSteps, setShowSteps] = useState(true);
    const [lowerBound, setLowerBound] = useState('0');
    const [upperBound, setUpperBound] = useState('');

    const generateSteps = (expr: string, op: 'differentiate' | 'integrate'): string[] => {
        const stepsArr: string[] = [];
        stepsArr.push(`Given: f(x) = ${expr}`);
        stepsArr.push(`Operation: ${op === 'differentiate' ? 'Differentiation' : 'Integration'}`);
        stepsArr.push(`---`);

        const terms = expr.replace(/\s/g, '').split(/(?=[+-])/);
        terms.forEach((term, i) => {
            stepsArr.push(`Term ${i + 1}: ${term}`);
            if (/x\^(\d+)/.test(term)) stepsArr.push(`  → Apply power rule`);
            else if (/sin|cos|tan/.test(term)) stepsArr.push(`  → Apply trig rule`);
            else if (/e\^x|ln/.test(term)) stepsArr.push(`  → Apply exponential/log rule`);
            else stepsArr.push(`  → Apply standard rule`);
        });

        stepsArr.push(`---`);
        return stepsArr;
    };

    const calculate = () => {
        setError(null);
        setResult(null);
        setSteps([]);
        setGraphData([]);

        try {
            let res: string;
            const generatedSteps = generateSteps(expression, operation);

            if (operation === 'differentiate') {
                res = nerdamer(`diff(${expression}, ${variable})`).toString();
                generatedSteps.push(`Result: f'(x) = ${res}`);
            } else {
                if (upperBound && lowerBound) {
                    res = nerdamer(`defint(${expression}, ${lowerBound}, ${upperBound}, ${variable})`).toString();
                    generatedSteps.push(`Definite Integral [${lowerBound}, ${upperBound}]: ${res}`);
                } else {
                    res = nerdamer(`integrate(${expression}, ${variable})`).toString();
                    generatedSteps.push(`Result: ∫f(x)dx = ${res} + C`);
                }
            }

            setResult(res);
            setSteps(generatedSteps);
            if (showGraph) generateGraphData(expression, res);
        } catch (e: any) {
            setError(e.message || 'Invalid expression.');
        }
    };

    const generateGraphData = (originalExpr: string, resultExpr: string) => {
        const data: { x: number; original: number; result: number }[] = [];
        for (let x = -5; x <= 5; x += 0.2) {
            try {
                const xStr = x.toString();
                const originalVal = parseFloat(nerdamer(originalExpr, { x: xStr }).text('decimals'));
                const resultVal = parseFloat(nerdamer(resultExpr, { x: xStr }).text('decimals'));
                if (Math.abs(originalVal) < 100 && Math.abs(resultVal) < 100 && !isNaN(originalVal) && !isNaN(resultVal)) {
                    data.push({ x: parseFloat(x.toFixed(2)), original: parseFloat(originalVal.toFixed(4)), result: parseFloat(resultVal.toFixed(4)) });
                }
            } catch { }
        }
        setGraphData(data);
    };

    const examples = [
        { expr: 'x^3 + 2*x^2 - x + 5', label: 'Polynomial' },
        { expr: 'sin(x) + cos(x)', label: 'Trig' },
        { expr: 'e^x + ln(x)', label: 'Exp/Log' },
    ];

    return (
        <div className="space-y-6">
            <Card className="shadow-xl border-primary/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" />Symbolic Calculus</CardTitle>
                    <CardDescription>Enter a function to differentiate or integrate</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Tabs value={operation} onValueChange={(v) => setOperation(v as any)} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="differentiate">d/dx Differentiate</TabsTrigger>
                            <TabsTrigger value="integrate">∫ Integrate</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-3 space-y-2">
                            <Label>Function f(x)</Label>
                            <Input value={expression} onChange={(e) => setExpression(e.target.value)} placeholder="e.g., x^3 + 2*x - sin(x)" className="font-mono text-lg h-12" />
                        </div>
                        <div className="space-y-2">
                            <Label>Variable</Label>
                            <Input value={variable} onChange={(e) => setVariable(e.target.value)} placeholder="x" className="font-mono text-lg h-12" />
                        </div>
                    </div>

                    {operation === 'integrate' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Lower Bound</Label><Input value={lowerBound} onChange={(e) => setLowerBound(e.target.value)} className="font-mono" /></div>
                            <div className="space-y-2"><Label>Upper Bound</Label><Input value={upperBound} onChange={(e) => setUpperBound(e.target.value)} className="font-mono" /></div>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                        <Button onClick={calculate} className="gap-2"><Play className="w-4 h-4" />Calculate</Button>
                        <Button variant="outline" onClick={() => setShowGraph(!showGraph)} className="gap-2"><Eye className="w-4 h-4" />{showGraph ? 'Hide' : 'Show'} Graph</Button>
                        <Button variant="ghost" onClick={() => { setExpression(''); setResult(null); setSteps([]); setError(null); setGraphData([]); }} className="gap-2"><RotateCcw className="w-4 h-4" />Clear</Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm text-muted-foreground">Examples:</span>
                        {examples.map((ex) => (<Button key={ex.label} variant="outline" size="sm" onClick={() => setExpression(ex.expr)}>{ex.label}</Button>))}
                    </div>
                </CardContent>
            </Card>

            {error && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400"><strong>Error:</strong> {error}</motion.div>)}

            {result && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader><CardTitle className="text-primary">Result</CardTitle></CardHeader>
                        <CardContent>
                            <div className="text-2xl font-mono font-bold text-center py-4 overflow-x-auto">
                                {operation === 'differentiate' ? "f'(x) = " : "∫f(x)dx = "}{result}{operation === 'integrate' && !upperBound && ' + C'}
                            </div>
                        </CardContent>
                    </Card>

                    {(showSteps || isStudyMode) && steps.length > 0 && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2"><Info className="w-4 h-4" />Steps</CardTitle>
                                <Button variant="ghost" size="sm" onClick={() => setShowSteps(!showSteps)}>{showSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</Button>
                            </CardHeader>
                            <AnimatePresence>
                                {showSteps && (
                                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}>
                                        <CardContent className="space-y-1">
                                            {steps.map((step, i) => (<motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className={`font-mono text-sm ${step === '---' ? 'border-t border-border my-2' : ''}`}>{step !== '---' && step}</motion.div>))}
                                        </CardContent>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>
                    )}
                </motion.div>
            )}

            {showGraph && result && graphData.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Card>
                        <CardHeader><CardTitle>Graph</CardTitle></CardHeader>
                        <CardContent>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={graphData}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                        <XAxis dataKey="x" stroke="#94a3b8" />
                                        <YAxis stroke="#94a3b8" />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                        <ReferenceLine x={0} stroke="#64748b" />
                                        <ReferenceLine y={0} stroke="#64748b" />
                                        <Line type="monotone" dataKey="original" name="f(x)" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                        <Line type="monotone" dataKey="result" name={operation === 'differentiate' ? "f'(x)" : "∫f(x)dx"} stroke="#10b981" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {isStudyMode && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-warning/30 bg-warning/5">
                            <CardHeader><CardTitle className="text-warning text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4" />What is a Derivative?</CardTitle></CardHeader>
                            <CardContent className="text-xs space-y-2">
                                <p>Geometrically, a derivative represents the <strong>slope of the tangent line</strong> to a curve at a point. It's the "instantaneous rate of change".</p>
                                <div className="bg-background/50 p-2 rounded font-mono text-center">lim(h→0) [f(x+h) - f(x)] / h</div>
                            </CardContent>
                        </Card>
                        <Card className="border-warning/30 bg-warning/5">
                            <CardHeader><CardTitle className="text-warning text-sm flex items-center gap-2"><Calculator className="w-4 h-4" />What is an Integral?</CardTitle></CardHeader>
                            <CardContent className="text-xs space-y-2">
                                <p>An integral represents the <strong>accumulation of quantity</strong>, most commonly visualized as the "area under the curve".</p>
                                <div className="bg-background/50 p-2 rounded font-mono text-center">∫ f(x) dx ≈ Σ f(x_i) Δx</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-warning/30 bg-warning/5">
                            <CardHeader><CardTitle className="text-warning text-sm">Common Derivatives</CardTitle></CardHeader>
                            <CardContent className="text-xs font-mono grid grid-cols-2 gap-1">
                                <div>d/dx[c] = 0</div><div>d/dx[x^n] = nx^(n-1)</div>
                                <div>d/dx[sin(x)] = cos(x)</div><div>d/dx[cos(x)] = -sin(x)</div>
                                <div>d/dx[e^x] = e^x</div><div>d/dx[ln(x)] = 1/x</div>
                            </CardContent>
                        </Card>
                        <Card className="border-warning/30 bg-warning/5">
                            <CardHeader><CardTitle className="text-warning text-sm">Common Integrals</CardTitle></CardHeader>
                            <CardContent className="text-xs font-mono grid grid-cols-2 gap-1">
                                <div>∫c dx = cx + C</div><div>∫x^n dx = x^(n+1)/(n+1)</div>
                                <div>∫sin(x) dx = -cos(x)</div><div>∫cos(x) dx = sin(x)</div>
                                <div>∫e^x dx = e^x</div><div>∫1/x dx = ln|x|</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="border-warning/30 bg-warning/5">
                        <CardHeader><CardTitle className="text-warning text-sm">How do calculators compute sin(x)?</CardTitle></CardHeader>
                        <CardContent className="text-xs space-y-2">
                            <p>Most calculators don't have a "giant table". They use <strong>Taylor Series</strong> expansion to approximate functions as infinite polynomials:</p>
                            <div className="bg-background/50 p-2 rounded font-mono text-center text-[10px]">
                                sin(x) ≈ x - x³/3! + x⁵/5! - x⁷/7! + ...
                            </div>
                            <p className="italic text-muted-foreground">The more terms added, the more accurate the result!</p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
};

// ============== MAIN COMPONENT ==============
const EngineeringMathematics = () => {
    const [isStudyMode, setIsStudyMode] = useState(false);
    const [activeTab, setActiveTab] = useState('standard');

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 flex flex-col min-h-0">
                    <div className="px-6 py-3 border-b border-border bg-card/50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Calculator className="w-4 h-4 text-primary" />
                                <span className="font-semibold">Engineering Calculator</span>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                                <Switch id="study-mode" checked={isStudyMode} onCheckedChange={setIsStudyMode} />
                                <Label htmlFor="study-mode" className={`text-sm cursor-pointer flex items-center gap-2 ${isStudyMode ? 'text-warning font-medium' : 'text-muted-foreground'}`}>
                                    <GraduationCap className="w-4 h-4" />Study Mode
                                </Label>
                            </div>
                        </div>
                        {isStudyMode && (<span className="text-xs text-warning bg-warning/10 px-3 py-1 rounded-full border border-warning/30 animate-pulse">Educational context active</span>)}
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto">
                        <div className="max-w-6xl mx-auto space-y-6">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-6">
                                    <TabsTrigger value="standard" className="gap-2"><Calculator className="w-4 h-4" />Standard Calculator</TabsTrigger>
                                    <TabsTrigger value="calculus" className="gap-2"><TrendingUp className="w-4 h-4" />Calculus (d/dx, ∫)</TabsTrigger>
                                </TabsList>

                                <TabsContent value="standard"><StandardCalculator /></TabsContent>
                                <TabsContent value="calculus"><CalculusCalculator isStudyMode={isStudyMode} /></TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EngineeringMathematics;
