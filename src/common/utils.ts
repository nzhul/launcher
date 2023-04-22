import * as _ from 'underscore';

export function extractVersion(fileName: string): number {
  return parseInt(fileName.match(/-v(\d+)\.zip$/)[1]);
}

const validate = (
  string: string,
  ruleOverrides?: { [key: string]: any; message: string }[],
  compareString?: string,
): { valid: boolean; message: string } => {
  const rules = [
    { required: true, message: 'Required!' },
    { min: 3, message: 'Minimum length is 3 characters!' },
    { max: 100, message: `Maximum length is 100 characters!` },
    { match: '^[a-zA-Z0-9_-]*$', message: 'Invalid value!' },
    { compare: '_', message: 'Values do not match!' },
  ] as { [key: string]: any; message: string }[];

  if (ruleOverrides) {
    ruleOverrides.forEach((override) => {
      const ruleName = Object.keys(override)[0];
      const ruleIndex = rules.findIndex((r) =>
        Object.prototype.hasOwnProperty.call(r, ruleName),
      );

      rules[ruleIndex] = override;
    });
  }

  // required
  const requiredRule = _.find(rules, (rule) =>
    Object.prototype.hasOwnProperty.call(rule, 'required'),
  );

  if (requiredRule) {
    if (requiredRule.required && !string) {
      return { valid: false, message: requiredRule.message };
    }
  }

  // min
  const minRule = _.find(rules, (rule) =>
    Object.prototype.hasOwnProperty.call(rule, 'min'),
  ) as { min: number; message: string };

  if (minRule) {
    if (string.length < minRule.min) {
      return { valid: false, message: minRule.message };
    }
  }

  // max
  const maxRule = _.find(rules, (rule) =>
    Object.prototype.hasOwnProperty.call(rule, 'max'),
  ) as { max: number; message: string };

  if (maxRule) {
    if (string.length > maxRule.max) {
      return { valid: false, message: maxRule.message };
    }
  }

  // match
  const matchRule = _.find(rules, (rule) =>
    Object.prototype.hasOwnProperty.call(rule, 'match'),
  ) as { match: string; message: string };

  if (matchRule) {
    const regex = new RegExp(matchRule.match);
    if (!regex.test(string)) {
      return { valid: false, message: matchRule.message };
    }
  }

  if (compareString) {
    if (string !== compareString) {
      const compareRule = _.find(rules, (rule) =>
        Object.prototype.hasOwnProperty.call(rule, 'compare'),
      ) as { match: string; message: string };
      return { valid: false, message: compareRule.message };
    }
  }

  return { valid: true, message: '' };
};

const Validator = {
  validate: (
    string: string,
    ruleOverrides?: { [key: string]: any; message: string }[],
    compareString?: string,
  ) => validate(string, ruleOverrides, compareString),
};

const generateURL = (to: string) => {
  const baseurl = process.env.PUBLIC_URL;

  return baseurl ? `${baseurl}${to}` : to;
};

const stringCaseInsensitiveEquals = (first: string, second: string) => {
  if (first === undefined || second === undefined) {
    return false;
  }

  return first.trim().toLowerCase() === second.trim().toLowerCase();
};

export default Validator;

export { generateURL, stringCaseInsensitiveEquals };
