import sys, json, traceback, io, contextlib, ast
import base64
import matplotlib.pyplot as plt
from io import BytesIO

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
    
def capture_figures():
    images = []
    for fig_num in plt.get_fignums():
        fig = plt.figure(fig_num)
        buf = BytesIO()
        fig.savefig(buf, format="png", bbox_inches="tight")
        buf.seek(0)
        images.append(base64.b64encode(buf.read()).decode("utf-8"))
        plt.close(fig)
    return images


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

            images = capture_figures()

            out = {
                "id": msg_id,
                "ok": True,
                "stdout": stdout_buf.getvalue(),
                "stderr": stderr_buf.getvalue(),
                "result": None if result is None else repr(result),
                "images": images,  
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
