from manim import *

class Grade7PrealgebraMedium5(Scene):
    def construct(self):
        equation = MathTex(
            "100 - 4^2 + 3 \times (10 - 7) &= 100 - 4^2 + 3 \times 3 \\",
            "&= 100 - 16 + 3 \times 3 \\",
            "&= 100 - 16 + 9 \\",
            "&= 84 + 9 \\",
            "&= 93"
        )

        self.play(Write(equation[0]))
        self.wait(1)
        self.play(TransformMatchingTex(equation[0].copy(), equation[1]))
        self.wait(1)
        self.play(TransformMatchingTex(equation[1].copy(), equation[2]))
        self.wait(1)
        self.play(TransformMatchingTex(equation[2].copy(), equation[3]))
        self.wait(1)
        self.play(TransformMatchingTex(equation[3].copy(), equation[4]))
        self.wait(2)
