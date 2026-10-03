import { AngleMode } from '../types/calculator';

export interface CalculationResult {
  value: string;
  isError: boolean;
  errorMessage?: string;
}

export function formatNumberForDisplay(numStr: string): string {
  if (!numStr || numStr === 'Error' || numStr === 'Infinity' || numStr === '-Infinity' || numStr === 'NaN') {
    return numStr;
  }

  // If scientific notation already
  if (numStr.includes('e') || numStr.includes('E')) {
    return numStr;
  }

  const parts = numStr.split('.');
  const intPart = parts[0];
  const decPart = parts.length > 1 ? parts[1] : undefined;

  // Format integer part with thousands separator (e.g., 1,000,000)
  const isNegative = intPart.startsWith('-');
  const rawInt = isNegative ? intPart.slice(1) : intPart;
  const formattedInt = rawInt.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  if (decPart !== undefined) {
    return `${isNegative ? '-' : ''}${formattedInt},${decPart}`;
  }
  return `${isNegative ? '-' : ''}${formattedInt}`;
}

export function evaluateExpression(expr: string, angleMode: AngleMode = 'deg'): CalculationResult {
  try {
    if (!expr.trim()) {
      return { value: '0', isError: false };
    }

    // Sanitize and replace user-friendly symbols
    let sanitized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, `${Math.PI}`)
      .replace(/e(?![a-z])/g, `${Math.E}`);

    // Check for division by zero pattern
    if (/\/0(?!\.)(?!\d)/.test(sanitized)) {
      return { value: 'Erro: Divisão por 0', isError: true };
    }

    // Handle percentage: e.g. 50 + 10% -> 50 + (50 * 0.1) or stand-alone 50% -> 0.5
    sanitized = sanitized.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

    // Handle square root: sqrt(x) or √(x)
    sanitized = sanitized.replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)');
    sanitized = sanitized.replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt($1)');

    // Handle powers: x^y
    sanitized = sanitized.replace(/\^/g, '**');

    // Handle trig functions: sin, cos, tan
    if (angleMode === 'deg') {
      sanitized = sanitized.replace(/sin\(([^)]+)\)/g, 'Math.sin(($1) * Math.PI / 180)');
      sanitized = sanitized.replace(/cos\(([^)]+)\)/g, 'Math.cos(($1) * Math.PI / 180)');
      sanitized = sanitized.replace(/tan\(([^)]+)\)/g, 'Math.tan(($1) * Math.PI / 180)');
    } else {
      sanitized = sanitized.replace(/sin\(([^)]+)\)/g, 'Math.sin($1)');
      sanitized = sanitized.replace(/cos\(([^)]+)\)/g, 'Math.cos($1)');
      sanitized = sanitized.replace(/tan\(([^)]+)\)/g, 'Math.tan($1)');
    }

    // Handle log and ln
    sanitized = sanitized.replace(/ln\(([^)]+)\)/g, 'Math.log($1)');
    sanitized = sanitized.replace(/log\(([^)]+)\)/g, 'Math.log10($1)');

    // Validate characters to ensure no malicious code execution
    if (!/^[0-9+\-*/().\s*Math,PIEesincotaglq]+$/.test(sanitized)) {
      return { value: 'Erro de sintaxe', isError: true };
    }

    // Evaluate in safe function scope
    // eslint-disable-next-line no-new-func
    const rawVal = Function(`"use strict"; return (${sanitized});`)();

    if (rawVal === undefined || rawVal === null || isNaN(rawVal)) {
      return { value: 'Erro', isError: true };
    }

    if (!isFinite(rawVal)) {
      return { value: 'Infinito', isError: true };
    }

    // Clean up precision floating point issues (e.g. 0.1 + 0.2 = 0.30000000000000004)
    const rounded = Math.round((rawVal + Number.EPSILON) * 1e12) / 1e12;
    const strVal = rounded.toString();

    return { value: strVal, isError: false };
  } catch {
    return { value: 'Erro de sintaxe', isError: true };
  }
}

export function factorial(n: number): number {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= Math.min(n, 170); i++) {
    res *= i;
  }
  return res;
}
