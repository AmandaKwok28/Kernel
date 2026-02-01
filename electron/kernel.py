import sys, json, traceback, io, contextlib, ast

GLOBALS = {"__name__": "__main__"}

def eval_last_expr(code: str):
    """
    Executes code, and if the last statement is an expression, evaluates it and returns it.
    This mimics notebook-ish behavior.
    """
    tree = ast.parse(code, mode="exec")
    if len(tree.body) == 0:
        exec(compile(tree, "<cell>", "exec"), GLOBALS, GLOBALS)
        return None

    last = tree.body[-1]
    if isinstance(last, ast.Expr):
        # execute all but last
        prefix = ast.Module(body=tree.body[:-1], type_ignores=[])
        exec(compile(prefix, "<cell>", "exec"), GLOBALS, GLOBALS)
        # evaluate last expr
        expr = ast.Expression(body=last.value)
        return eval(compile(expr, "<cell>", "eval"), GLOBALS, GLOBALS)
    else:
        exec(compile(tree, "<cell>", "exec"), GLOBALS, GLOBALS)
        return None

def main():
    # Read one JSON object per line (JSONL)
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue

        try:
            msg = json.loads(line)
            msg_id = msg.get("id")
            code = msg.get("code", "")
            op = msg.get("op", "exec")

            if op == "reset":
                GLOBALS.clear()
                GLOBALS["__name__"] = "__main__"
                out = {"id": msg_id, "ok": True, "stdout": "", "stderr": "", "result": None}
                sys.stdout.write(json.dumps(out) + "\n")
                sys.stdout.flush()
                continue

            stdout_buf = io.StringIO()
            stderr_buf = io.StringIO()

            with contextlib.redirect_stdout(stdout_buf), contextlib.redirect_stderr(stderr_buf):
                result = eval_last_expr(code)

            out = {
                "id": msg_id,
                "ok": True,
                "stdout": stdout_buf.getvalue(),
                "stderr": stderr_buf.getvalue(),
                "result": None if result is None else repr(result),
            }
            sys.stdout.write(json.dumps(out) + "\n")
            sys.stdout.flush()

        except Exception:
            err = traceback.format_exc()
            out = {"id": msg.get("id") if 'msg' in locals() else None, "ok": False, "error": err}
            sys.stdout.write(json.dumps(out) + "\n")
            sys.stdout.flush()

if __name__ == "__main__":
    main()
