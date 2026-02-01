import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import {
    Calculator,
    Delete,
    History,
    Trash2,
    RotateCcw,
    ChevronDown,
    ChevronUp,
    Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const EngineeringMathematics = () => {
    const [display, setDisplay] = useState('0');
    const [equation, setEquation] = useState('');
    const [history, setHistory] = useState<{ eq: string; res: string }[]>([]);
    const [isRadians, setIsRadians] = useState(true);
    const [showHistory, setShowHistory] = useState(false);
    const [memory, setMemory] = useState<number>(0);

    const safeEvaluate = (expression: string) => {
        try {
            // Replace engineering functions with JS Math equivalents
            let evalString = expression
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/π/g, 'Math.PI')
                .replace(/e/g, 'Math.E')
                .replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)')
                .replace(/sin\(/g, isRadians ? 'Math.sin(' : `Math.sin((Math.PI/180)*`)
                .replace(/cos\(/g, isRadians ? 'Math.cos(' : `Math.cos((Math.PI/180)*`)
                .replace(/tan\(/g, isRadians ? 'Math.tan(' : `Math.tan((Math.PI/180)*`)
                .replace(/log\(/g, 'Math.log10(')
                .replace(/ln\(/g, 'Math.log(')
                .replace(/\^/g, '**');

            // Handle implicit multiplication (e.g., 2PI -> 2*Math.PI)
            // This is a simplified regex, might need more robustness for complex cases
            // but calculator inputs are usually structured.

            // Using Function constructor for safe-ish eval of math only
            // eslint-disable-next-line @typescript-eslint/no-implied-eval
            const result = new Function('return ' + evalString)();
            return parseFloat(result.toFixed(8)).toString();
        } catch (error) {
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
            const suffix = '(';
            return isZero ? func + suffix : prev + func + suffix;
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

    // Keyboard support
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const key = e.key;
        if (/[0-9.]/.test(key)) handlePress(key);
        if (['+', '-', '*', '/'].includes(key)) handleOperation(key === '*' ? '×' : key === '/' ? '÷' : key);
        if (key === 'Enter') handleEqual();
        if (key === 'Backspace') handleDelete();
        if (key === 'Escape') handleClear();
        if (key === '(' || key === ')') handlePress(key);
    }, [display]); // Depend on display if needed, but setState functional updates handle it.

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const Btn = ({ label, onClick, variant = 'default', className = '' }: { label: React.ReactNode, onClick: () => void, variant?: 'default' | 'secondary' | 'accent' | 'ghost', className?: string }) => {
        const baseStyle = "h-14 text-lg font-medium transition-all duration-200 active:scale-95";
        const variants = {
            default: "bg-secondary/50 hover:bg-secondary/80 text-foreground",
            secondary: "bg-muted/50 hover:bg-muted/80 text-muted-foreground",
            accent: "bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20",
            ghost: "hover:bg-accent/20 text-accent-foreground"
        };

        return (
            <Button
                variant="ghost"
                className={`${baseStyle} ${variants[variant]} ${className}`}
                onClick={onClick}
            >
                {label}
            </Button>
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto">
                    <div className="max-w-4xl mx-auto w-full space-y-6">

                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Calculator className="w-6 h-6 text-primary" />
                                Engineering Calculator
                            </h2>
                            <div className="flex gap-2">
                                <Button
                                    variant={isRadians ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setIsRadians(true)}
                                >
                                    RAD
                                </Button>
                                <Button
                                    variant={!isRadians ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setIsRadians(false)}
                                >
                                    DEG
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Calculator Interface */}
                            <Card className="md:col-span-2 shadow-xl border-primary/10">
                                <CardHeader className="bg-muted/20 pb-2">
                                    <div className="flex justify-between items-center text-xs text-muted-foreground px-1 h-6">
                                        <span>{equation}</span>
                                        <span className="font-mono">{isRadians ? 'RAD' : 'DEG'}</span>
                                    </div>
                                    <div className="text-4xl font-mono font-medium text-right tracking-wider py-4 px-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
                                        {display}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="grid grid-cols-5 gap-3">
                                        {/* Row 1: Memory & Clear */}
                                        <Btn label="MC" variant="secondary" onClick={() => setMemory(0)} />
                                        <Btn label="MR" variant="secondary" onClick={() => setDisplay(memory.toString())} />
                                        <Btn label="M+" variant="secondary" onClick={() => setMemory(m => m + parseFloat(display))} />
                                        <Btn label="AC" variant="secondary" className="text-red-400" onClick={handleClear} />
                                        <Btn label={<Delete className="w-5 h-5" />} variant="secondary" className="text-orange-400" onClick={handleDelete} />

                                        {/* Row 2: Sci Functions */}
                                        <Btn label="sin" variant="secondary" onClick={() => handleFunction('sin')} />
                                        <Btn label="cos" variant="secondary" onClick={() => handleFunction('cos')} />
                                        <Btn label="tan" variant="secondary" onClick={() => handleFunction('tan')} />
                                        <Btn label="(" variant="secondary" onClick={() => handlePress('(')} />
                                        <Btn label=")" variant="secondary" onClick={() => handlePress(')')} />

                                        {/* Row 3: More Sci */}
                                        <Btn label="ln" variant="secondary" onClick={() => handleFunction('ln')} />
                                        <Btn label="log" variant="secondary" onClick={() => handleFunction('log')} />
                                        <Btn label="x²" variant="secondary" onClick={() => setDisplay(p => `${p}^2`)} />
                                        <Btn label="√" variant="secondary" onClick={() => handleFunction('√')} />
                                        <Btn label="x^y" variant="secondary" onClick={() => setDisplay(p => `${p}^`)} />

                                        {/* Row 4: Numbers & Basic Op */}
                                        <Btn label="7" onClick={() => handlePress('7')} />
                                        <Btn label="8" onClick={() => handlePress('8')} />
                                        <Btn label="9" onClick={() => handlePress('9')} />
                                        <Btn label="÷" variant="default" className="bg-primary/10 text-primary" onClick={() => handleOperation('÷')} />
                                        <Btn label="π" variant="secondary" onClick={() => handlePress('π')} />

                                        {/* Row 5 */}
                                        <Btn label="4" onClick={() => handlePress('4')} />
                                        <Btn label="5" onClick={() => handlePress('5')} />
                                        <Btn label="6" onClick={() => handlePress('6')} />
                                        <Btn label="×" variant="default" className="bg-primary/10 text-primary" onClick={() => handleOperation('×')} />
                                        <Btn label="e" variant="secondary" onClick={() => handlePress('e')} />

                                        {/* Row 6 */}
                                        <Btn label="1" onClick={() => handlePress('1')} />
                                        <Btn label="2" onClick={() => handlePress('2')} />
                                        <Btn label="3" onClick={() => handlePress('3')} />
                                        <Btn label="-" variant="default" className="bg-primary/10 text-primary" onClick={() => handleOperation('-')} />
                                        <Btn label="Ans" variant="secondary" onClick={() => history.length > 0 && setDisplay(history[0].res)} />

                                        {/* Row 7 */}
                                        <Btn label="0" className="col-span-2" onClick={() => handlePress('0')} />
                                        <Btn label="." onClick={() => handlePress('.')} />
                                        <Btn label="=" variant="accent" onClick={handleEqual} />
                                        <Btn label="+" variant="default" className="bg-primary/10 text-primary" onClick={() => handleOperation('+')} />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* History Sidebar */}
                            <div className="space-y-6">
                                <Card className="h-full flex flex-col">
                                    <CardHeader className="py-4 border-b">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <History className="w-4 h-4" />
                                                History
                                            </CardTitle>
                                            <Button variant="ghost" size="icon" onClick={() => setHistory([])} disabled={history.length === 0}>
                                                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-400" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <ScrollArea className="flex-1 p-4 h-[500px]">
                                        <div className="space-y-4">
                                            {history.length === 0 ? (
                                                <div className="text-center text-muted-foreground text-sm py-8">
                                                    No calculations yet
                                                </div>
                                            ) : (
                                                history.map((item, i) => (
                                                    <div
                                                        key={i}
                                                        className="group flex flex-col items-end p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors border border-transparent hover:border-border"
                                                        onClick={() => setDisplay(item.res)}
                                                    >
                                                        <span className="text-xs text-muted-foreground mb-1">{item.eq} =</span>
                                                        <span className="text-lg font-mono font-medium text-primary">{item.res}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </ScrollArea>
                                </Card>

                                <Card>
                                    <CardHeader className="py-3">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                                            <Settings className="w-4 h-4" />
                                            Constants
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-2 text-sm">
                                        <Button variant="outline" className="justify-between" onClick={() => handlePress('3.14159265')}>
                                            <span>π</span>
                                            <span className="text-xs text-muted-foreground">3.14159</span>
                                        </Button>
                                        <Button variant="outline" className="justify-between" onClick={() => handlePress('2.71828182')}>
                                            <span>e</span>
                                            <span className="text-xs text-muted-foreground">2.71828</span>
                                        </Button>
                                        <Button variant="outline" className="justify-between" onClick={() => handlePress('9.81')}>
                                            <span>g</span>
                                            <span className="text-xs text-muted-foreground">9.81</span>
                                        </Button>
                                        <Button variant="outline" className="justify-between" onClick={() => handlePress('299792458')}>
                                            <span>c</span>
                                            <span className="text-xs text-muted-foreground">3.00e8</span>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EngineeringMathematics;
