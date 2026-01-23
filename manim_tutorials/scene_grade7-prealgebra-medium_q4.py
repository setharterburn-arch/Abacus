from manim import *

class Grade7PrealgebraMedium4(Scene):
    def construct(self):
        equation = MathTex(
            "24 \div (2 \times (5 - 2)) + 1 &= 24 \div (2 \times 3) + 1 \\",
            "&= 24 \div 6 + 1 \\",
            "&= 4 + 1 \\",
            "&= 5"
        )

        self.play(Write(equation[0]))
        self.wait(1)
        self.play(TransformMatchingTex(equation[0].copy(), equation[1]))
        self.wait(1)
        self.play(TransformMatchingTex(equation[1].copy(), equation[2]))
        self.wait(1)
        self.play(TransformMatchingTex(equation[2].copy(), equation[3]))
        self.wait(2)
