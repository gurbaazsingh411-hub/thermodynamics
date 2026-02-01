import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
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
    GraduationCap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Area,
    AreaChart
} from 'recharts';

// Import nerdamer and its modules
import nerdamer from 'nerdamer';
import 'nerdamer/Calculus';
import 'nerdamer/Algebra';
import 'nerdamer/Solve';

// Differentiation rules for step-by-step
const DIFF_RULES: { [key: string]: { pattern: RegExp; rule: string; example: string } } = {
    constant: { pattern: /^\d+$/, rule: "d/dx[c] = 0", example: "d/dx[5] = 0" },
    power: { pattern: /x\^(\d+)/, rule: "d/dx[x^n] = n·x^(n-1)", example: "d/dx[x³] = 3x²" },
    linear: { pattern: /^x$/, rule: "d/dx[x] = 1", example: "d/dx[x] = 1" },
    sin: { pattern: /sin\(x\)/, rule: "d/dx[sin(x)] = cos(x)", example: "d/dx[sin(x)] = cos(x)" },
    cos: { pattern: /cos\(x\)/, rule: "d/dx[cos(x)] = -sin(x)", example: "d/dx[cos(x)] = -sin(x)" },
    exp: { pattern: /e\^x/, rule: "d/dx[e^x] = e^x", example: "d/dx[e^x] = e^x" },
    ln: { pattern: /ln\(x\)/, rule: "d/dx[ln(x)] = 1/x", example: "d/dx[ln(x)] = 1/x" },
};

// Integration rules for step-by-step
const INT_RULES: { [key: string]: { pattern: RegExp; rule: string; example: string } } = {
    constant: { pattern: /^\d+$/, rule: "∫c dx = cx + C", example: "∫5 dx = 5x + C" },
    power: { pattern: /x\^(\d+)/, rule: "∫x^n dx = x^(n+1)/(n+1) + C", example: "∫x² dx = x³/3 + C" },
    linear: { pattern: /^x$/, rule: "∫x dx = x²/2 + C", example: "∫x dx = x²/2 + C" },
    sin: { pattern: /sin\(x\)/, rule: "∫sin(x) dx = -cos(x) + C", example: "∫sin(x) dx = -cos(x) + C" },
    cos: { pattern: /cos\(x\)/, rule: "∫cos(x) dx = sin(x) + C", example: "∫cos(x) dx = sin(x) + C" },
    exp: { pattern: /e\^x/, rule: "∫e^x dx = e^x + C", example: "∫e^x dx = e^x + C" },
    oneOverX: { pattern: /1\/x/, rule: "∫1/x dx = ln|x| + C", example: "∫1/x dx = ln|x| + C" },
};

const EngineeringMathematics = () => {
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
    const [isStudyMode, setIsStudyMode] = useState(false);

    // Generate step-by-step explanation
    const generateSteps = (expr: string, op: 'differentiate' | 'integrate'): string[] => {
        const stepsArr: string[] = [];
        const rules = op === 'differentiate' ? DIFF_RULES : INT_RULES;
        const symbol = op === 'differentiate' ? 'd/dx' : '∫';

        stepsArr.push(`Given: f(x) = ${expr}`);
        stepsArr.push(`Operation: ${op === 'differentiate' ? 'Differentiation' : 'Integration'}`);
        stepsArr.push(`---`);

        // Identify terms (simple split by + and -)
        const terms = expr.replace(/\s/g, '').split(/(?=[+-])/);

        terms.forEach((term, i) => {
            stepsArr.push(`Term ${i + 1}: ${term}`);

            // Try to match rules
            let ruleApplied = false;
            for (const [name, { pattern, rule, example }] of Object.entries(rules)) {
                if (pattern.test(term)) {
                    stepsArr.push(`  → Apply ${name} rule: ${rule}`);
                    ruleApplied = true;
                    break;
                }
            }

            if (!ruleApplied) {
                stepsArr.push(`  → Apply standard ${op} rule`);
            }
        });

        stepsArr.push(`---`);
        return stepsArr;
    };

    // Perform calculation
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
                    // Definite integral
                    res = nerdamer(`defint(${expression}, ${lowerBound}, ${upperBound}, ${variable})`).toString();
                    generatedSteps.push(`Definite Integral from ${lowerBound} to ${upperBound}:`);
                    generatedSteps.push(`Result: ∫f(x)dx = ${res}`);
                } else {
                    // Indefinite integral
                    res = nerdamer(`integrate(${expression}, ${variable})`).toString();
                    generatedSteps.push(`Result: ∫f(x)dx = ${res} + C`);
                }
            }

            setResult(res);
            setSteps(generatedSteps);

            // Generate graph data
            if (showGraph) {
                generateGraphData(expression, res);
            }
        } catch (e: any) {
            setError(e.message || 'Invalid expression. Please check your input.');
        }
    };

    // Generate graph data for visualization
    const generateGraphData = (originalExpr: string, resultExpr: string) => {
        const data: { x: number; original: number; result: number }[] = [];

        for (let x = -5; x <= 5; x += 0.2) {
            try {
                const originalVal = parseFloat(nerdamer(originalExpr, { x }).text('decimals'));
                const resultVal = parseFloat(nerdamer(resultExpr, { x }).text('decimals'));

                // Skip if values are too large or NaN
                if (Math.abs(originalVal) < 100 && Math.abs(resultVal) < 100 && !isNaN(originalVal) && !isNaN(resultVal)) {
                    data.push({
                        x: parseFloat(x.toFixed(2)),
                        original: parseFloat(originalVal.toFixed(4)),
                        result: parseFloat(resultVal.toFixed(4))
                    });
                }
            } catch {
                // Skip points that cause errors (like division by zero)
            }
        }

        setGraphData(data);
    };

    // Example expressions
    const examples = [
        { expr: 'x^3 + 2*x^2 - x + 5', label: 'Polynomial' },
        { expr: 'sin(x) + cos(x)', label: 'Trigonometric' },
        { expr: 'e^x + ln(x)', label: 'Exponential' },
        { expr: 'x^2 * sin(x)', label: 'Product' },
        { expr: '1/(x^2 + 1)', label: 'Rational' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 flex flex-col min-h-0">
                    {/* Study Mode Toggle */}
                    <div className="px-6 py-3 border-b border-border bg-card/50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Calculator className="w-4 h-4 text-primary" />
                                <span className="font-semibold">Calculus Calculator</span>
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                                <Switch
                                    id="study-mode"
                                    checked={isStudyMode}
                                    onCheckedChange={setIsStudyMode}
                                />
                                <Label
                                    htmlFor="study-mode"
                                    className={`text-sm cursor-pointer flex items-center gap-2 ${isStudyMode ? 'text-warning font-medium' : 'text-muted-foreground'}`}
                                >
                                    <GraduationCap className="w-4 h-4" />
                                    Study Mode
                                </Label>
                            </div>
                        </div>

                        {isStudyMode && (
                            <span className="text-xs text-warning bg-warning/10 px-3 py-1 rounded-full border border-warning/30 animate-pulse">
                                Step-by-step explanations active
                            </span>
                        )}
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto">
                        <div className="max-w-6xl mx-auto space-y-6">

                            {/* Main Calculator Card */}
                            <Card className="shadow-xl border-primary/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-primary" />
                                        Symbolic Calculus
                                    </CardTitle>
                                    <CardDescription>
                                        Enter a function to differentiate or integrate with step-by-step solutions
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Operation Tabs */}
                                    <Tabs value={operation} onValueChange={(v) => setOperation(v as any)} className="w-full">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="differentiate" className="gap-2">
                                                d/dx Differentiate
                                            </TabsTrigger>
                                            <TabsTrigger value="integrate" className="gap-2">
                                                ∫ Integrate
                                            </TabsTrigger>
                                        </TabsList>
                                    </Tabs>

                                    {/* Input Section */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="md:col-span-3 space-y-2">
                                            <Label>Function f(x)</Label>
                                            <Input
                                                value={expression}
                                                onChange={(e) => setExpression(e.target.value)}
                                                placeholder="e.g., x^3 + 2*x - sin(x)"
                                                className="font-mono text-lg h-12"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Variable</Label>
                                            <Input
                                                value={variable}
                                                onChange={(e) => setVariable(e.target.value)}
                                                placeholder="x"
                                                className="font-mono text-lg h-12"
                                            />
                                        </div>
                                    </div>

                                    {/* Integration Bounds (only for integration) */}
                                    {operation === 'integrate' && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Lower Bound (optional)</Label>
                                                <Input
                                                    value={lowerBound}
                                                    onChange={(e) => setLowerBound(e.target.value)}
                                                    placeholder="e.g., 0"
                                                    className="font-mono"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Upper Bound (optional)</Label>
                                                <Input
                                                    value={upperBound}
                                                    onChange={(e) => setUpperBound(e.target.value)}
                                                    placeholder="e.g., 1"
                                                    className="font-mono"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-3">
                                        <Button onClick={calculate} className="gap-2">
                                            <Play className="w-4 h-4" />
                                            Calculate
                                        </Button>
                                        <Button variant="outline" onClick={() => setShowGraph(!showGraph)} className="gap-2">
                                            <Eye className="w-4 h-4" />
                                            {showGraph ? 'Hide Graph' : 'Show Graph'}
                                        </Button>
                                        <Button variant="ghost" onClick={() => {
                                            setExpression('');
                                            setResult(null);
                                            setSteps([]);
                                            setError(null);
                                            setGraphData([]);
                                        }} className="gap-2">
                                            <RotateCcw className="w-4 h-4" />
                                            Clear
                                        </Button>
                                    </div>

                                    {/* Quick Examples */}
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-sm text-muted-foreground">Examples:</span>
                                        {examples.map((ex) => (
                                            <Button
                                                key={ex.label}
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setExpression(ex.expr)}
                                            >
                                                {ex.label}
                                            </Button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Error Display */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400"
                                >
                                    <strong>Error:</strong> {error}
                                </motion.div>
                            )}

                            {/* Results Section */}
                            {result && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                                >
                                    {/* Result Card */}
                                    <Card className="bg-primary/5 border-primary/20">
                                        <CardHeader>
                                            <CardTitle className="text-primary">Result</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-3xl font-mono font-bold text-center py-6 overflow-x-auto">
                                                {operation === 'differentiate' ? "f'(x) = " : "∫f(x)dx = "}
                                                {result}
                                                {operation === 'integrate' && !upperBound && ' + C'}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Steps Card */}
                                    {(showSteps || isStudyMode) && steps.length > 0 && (
                                        <Card>
                                            <CardHeader className="flex flex-row items-center justify-between">
                                                <CardTitle className="flex items-center gap-2">
                                                    <Info className="w-4 h-4" />
                                                    Step-by-Step Solution
                                                </CardTitle>
                                                <Button variant="ghost" size="sm" onClick={() => setShowSteps(!showSteps)}>
                                                    {showSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                </Button>
                                            </CardHeader>
                                            <AnimatePresence>
                                                {showSteps && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                    >
                                                        <CardContent className="space-y-2">
                                                            {steps.map((step, i) => (
                                                                <motion.div
                                                                    key={i}
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: i * 0.05 }}
                                                                    className={`font-mono text-sm py-1 ${step === '---' ? 'border-t border-border my-2' : ''}`}
                                                                >
                                                                    {step !== '---' && step}
                                                                </motion.div>
                                                            ))}
                                                        </CardContent>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </Card>
                                    )}
                                </motion.div>
                            )}

                            {/* Graph Visualization */}
                            {showGraph && result && graphData.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Graphical Visualization</CardTitle>
                                            <CardDescription>
                                                Comparing f(x) with its {operation === 'differentiate' ? 'derivative' : 'integral'}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-80 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={graphData}>
                                                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                                        <XAxis
                                                            dataKey="x"
                                                            stroke="#94a3b8"
                                                            label={{ value: 'x', position: 'insideBottomRight', offset: -5 }}
                                                        />
                                                        <YAxis
                                                            stroke="#94a3b8"
                                                            label={{ value: 'y', angle: -90, position: 'insideLeft' }}
                                                        />
                                                        <Tooltip
                                                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                                                            labelStyle={{ color: '#f8fafc' }}
                                                        />
                                                        <ReferenceLine x={0} stroke="#64748b" />
                                                        <ReferenceLine y={0} stroke="#64748b" />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="original"
                                                            name="f(x)"
                                                            stroke="#3b82f6"
                                                            strokeWidth={2}
                                                            dot={false}
                                                        />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="result"
                                                            name={operation === 'differentiate' ? "f'(x)" : "∫f(x)dx"}
                                                            stroke="#10b981"
                                                            strokeWidth={2}
                                                            dot={false}
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div className="flex justify-center gap-6 mt-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-1 bg-blue-500 rounded" />
                                                    <span>f(x) = {expression}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-1 bg-green-500 rounded" />
                                                    <span>{operation === 'differentiate' ? "f'(x)" : "∫f(x)dx"} = {result}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Study Mode Educational Content */}
                            {isStudyMode && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    <Card className="border-warning/30 bg-warning/5">
                                        <CardHeader>
                                            <CardTitle className="text-warning flex items-center gap-2">
                                                <Info className="w-5 h-5" />
                                                Differentiation Rules
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3 text-sm font-mono">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>d/dx[c] = 0</div>
                                                <div>d/dx[x^n] = nx^(n-1)</div>
                                                <div>d/dx[sin(x)] = cos(x)</div>
                                                <div>d/dx[cos(x)] = -sin(x)</div>
                                                <div>d/dx[e^x] = e^x</div>
                                                <div>d/dx[ln(x)] = 1/x</div>
                                            </div>
                                            <div className="pt-2 border-t border-warning/20 text-xs text-muted-foreground">
                                                <strong>Chain Rule:</strong> d/dx[f(g(x))] = f'(g(x)) · g'(x)
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-warning/30 bg-warning/5">
                                        <CardHeader>
                                            <CardTitle className="text-warning flex items-center gap-2">
                                                <Info className="w-5 h-5" />
                                                Integration Rules
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3 text-sm font-mono">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>∫c dx = cx + C</div>
                                                <div>∫x^n dx = x^(n+1)/(n+1)</div>
                                                <div>∫sin(x) dx = -cos(x)</div>
                                                <div>∫cos(x) dx = sin(x)</div>
                                                <div>∫e^x dx = e^x</div>
                                                <div>∫1/x dx = ln|x|</div>
                                            </div>
                                            <div className="pt-2 border-t border-warning/20 text-xs text-muted-foreground">
                                                <strong>Integration by Parts:</strong> ∫u dv = uv - ∫v du
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EngineeringMathematics;
